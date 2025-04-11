// Main execution function
(async () => {
  try {
    console.log("Starting Canvas Scraper...");
    await waitForDashboard();

    // First try to extract data from embedded JSON
    const jsonData = extractJSONFromScripts();
    console.log("=== DEBUG: Extracted JSON object(s) ===");
    jsonData.forEach((obj, index) => {
      try {
        console.log(`--- Object ${index + 1} ---`);
        console.log(JSON.stringify(obj, null, 2));
      } catch (err) {
        console.warn(`Could not stringify object ${index + 1}`, err);
      }
    });
    console.log("=== END DEBUG JSON DUMP ===");

    if (jsonData.length > 0) {
      console.log("Found JSON data in page scripts");

      // Extract favorite courses
      const favoriteCourses = extractFavoriteCourses(jsonData);
      if (favoriteCourses.length > 0) {
        console.log(`Found ${favoriteCourses.length} favorite courses`);
        await sendDataToServer('http://localhost:5000/favorites', favoriteCourses);

        // Process each favorite course
        for (const course of favoriteCourses) {
          try {
            console.log(`Processing favorite course: ${course.name}`);
            const baseUrl = normalizeCourseUrl(course.url);

            // Process each section (assignments, quizzes, pages)
            const additionalPaths = ["assignments", "quizzes", "pages"];
            for (const path of additionalPaths) {
              let targetUrl;
              if (baseUrl.endsWith('/')) {
                targetUrl = `${baseUrl}${path}`;
              } else {
                targetUrl = `${baseUrl}/${path}`;
              }
              console.log(`Navigating to ${path} at ${targetUrl}`);
              await navigateToSection(targetUrl);
              
              const contentData = await processCourseSection(path);

              if (contentData.length > 0) {
                await sendDataToServer(`http://localhost:5000/${log}`, contentData);
              }

              await returnToDashboard();
            }
          } catch (error) {
            console.error(`Error processing favorite course ${course.name}:`, error.message);
          }
        }
        return;
      }
    }

    console.log("Falling back to DOM scraping...");
    // ... rest of your fallback code ...

  } catch (error) {
    console.error("A serious error occurred:", error);
  }
})();

// Helper Functions

// Modified extractFavoriteCourses function to ensure proper URLs
function extractFavoriteCourses(jsonObjects) {
  const favoriteCourses = [];

  jsonObjects.forEach((obj) => {
    try {
      if (obj.STUDENT_PLANNER_COURSES && Array.isArray(obj.STUDENT_PLANNER_COURSES)) {
        processCourseArray(obj.STUDENT_PLANNER_COURSES);
      }
      if (obj.courses && Array.isArray(obj.courses)) {
        processCourseArray(obj.courses);
      }
      if (obj.current_user && obj.current_user.courses) {
        processCourseArray(obj.current_user.courses);
      }
    } catch (error) {
      console.warn("Error processing JSON object:", error);
    }
  });

  function processCourseArray(courses) {
    courses.forEach(course => {
      try {
        const isFavorite = course.isFavorited || course.is_favorited;
        if (isFavorite && (course.href || course.html_url)) {
          let url = course.href || course.html_url;
          
          // Ensure the URL is properly formatted
          if (!url.startsWith('http') && !url.startsWith('/')) {
            url = `/${url}`;
          }
          
          favoriteCourses.push({
            id: course.id,
            name: course.originalName || course.shortName || course.longName || course.name,
            url: url,
            pagesUrl: course.pagesUrl || (url ? `${url}/pages` : null)
          });
        }
      } catch (error) {
        console.warn("Error processing course:", error);
      }
    });
  }

  console.log(`Found ${favoriteCourses.length} favorite courses`);
  return favoriteCourses;
}

// New helper function to extract deadlines
function extractDeadlinesFromJSON(jsonObjects) {
  const deadlineData = [];

  jsonObjects.forEach(obj => {
    try {
      // Look for course deadlines in the JSON object
      if (obj.course_deadlines && Array.isArray(obj.course_deadlines)) {
        obj.course_deadlines.forEach(deadline => {
          const formattedDeadline = cleanDate(deadline.date);
          deadlineData.push({
            course: deadline.courseName,
            assignment: deadline.assignmentName,
            deadline: formattedDeadline,
            link: deadline.link
          });
        });
      }
    } catch (error) {
      console.warn("Error extracting deadlines from JSON:", error);
    }
  });

  return deadlineData;
}

// Helper functions to wait for the dashboard, normalize URLs, extract course sections, etc. (omitted for brevity)
// These are used in the main execution function above, as seen in the previous code blocks.

// Helper functions to send data to server, extract course content (assignments, quizzes, etc.) go here as before


async function waitForDashboard() {
  return new Promise((resolve) => {
    const check = () => {
      if (document.querySelector('.ic-DashboardCard') || document.querySelector('script[type="application/json"]')) {
        resolve();
      } else {
        setTimeout(check, 500);
      }
    };
    check();
  });
}

// Enhanced JSON extraction function
function extractJSONFromScripts() {
  const jsonObjects = [];
  const scripts = document.querySelectorAll('script');
  console.log(`Scanning ${scripts.length} <script> tags for JSON-like content...`);

  scripts.forEach((script, index) => {
    if (script.src || !script.textContent.trim()) return;

    const content = script.textContent.trim();
    console.log(`Script ${index} content length: ${content.length} chars`);

    // Try to extract all JSON-like objects from the script content
    const extracted = extractAllJSONObjects(content);
    if (extracted.length > 0) {
      jsonObjects.push(...extracted);
      console.log(`Found ${extracted.length} JSON objects in script ${index}`);
    }
  });

  console.log(`Total extracted JSON objects: ${jsonObjects.length}`);
  return jsonObjects;
}

// Helper function to extract all potential JSON objects from a string
function extractAllJSONObjects(content) {
  const objects = [];
  const jsonPattern = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
  let match;

  while ((match = jsonPattern.exec(content)) !== null) {
    try {
      const jsonStr = match[0];
      // Skip very small objects that are likely not real JSON
      if (jsonStr.length < 20) continue;
      
      const parsed = JSON.parse(jsonStr);
      objects.push(parsed);
      console.log(`Successfully parsed JSON object (${jsonStr.length} chars)`);
    } catch (error) {
      // Try to fix common JSON issues
      try {
        const fixedJsonStr = fixCommonJsonIssues(match[0]);
        const parsed = JSON.parse(fixedJsonStr);
        objects.push(parsed);
        console.log(`Successfully parsed after fixing issues (${fixedJsonStr.length} chars)`);
      } catch (fixError) {
        console.warn(`Could not parse potential JSON (${match[0].length} chars):`, fixError.message);
      }
    }
  }

  return objects;
}

// Helper function to fix common JSON formatting issues
function fixCommonJsonIssues(jsonStr) {
  // Fix unquoted property names
  let fixed = jsonStr.replace(/([{,]\s*)([a-zA-Z_$][\w$]*)(\s*:)/g, '$1"$2"$3');
  
  // Fix single quoted strings
  fixed = fixed.replace(/'([^']+)'/g, '"$1"');
  
  // Fix trailing commas
  fixed = fixed.replace(/,\s*([}\]])/g, '$1');
  
  // Fix JavaScript-style line comments
  fixed = fixed.replace(/\/\/.*$/gm, '');
  
  return fixed;
}

function cleanDate(date) {
  if (!date) return 'Unknown date';
  let cleaned = date.trim();

  // Attempt to strip redundant prefixes like weekday names or Swedish phrases
  const parts = cleaned.split(',');
  if (parts.length > 1) {
    cleaned = parts.slice(1).join(',').trim();
  }

  // Final clean-up for leading/trailing whitespace
  return cleaned;
}

async function extractCourseUrls() {
  await waitForDashboard();

  const jsonLd = document.querySelector('script[type="application/ld+json"]');
  if (jsonLd) {
    try {
      const data = JSON.parse(jsonLd.textContent);
      if (data.course) {
        return [data.course.url];
      }
    } catch (error) {
      console.warn("Couldn't parse JSON-LD:", error);
    }
  }

  const cards = document.querySelectorAll('.ic-DashboardCard__link');
  return Array.from(cards).map(card => card.href).filter(Boolean);
}

// Modified normalizeCourseUrl function to preserve full paths
function normalizeCourseUrl(url) {
  try {
    if (url.startsWith('http')) {
      return url;
    }
    
    if (url.startsWith('/')) {
      return `https://canvas.kth.se${url}`;
    }
    
    return `https://canvas.kth.se/${url}`;
  } catch (error) {
    console.error(`Error normalizing URL ${url}:`, error);
    return null;
  }
}

// Modified navigateToSection to handle URL normalization
async function navigateToSection(url) {
  try {
    const normalizedUrl = normalizeCourseUrl(url);
    if (!normalizedUrl) throw new Error('Invalid URL');

    console.log(`Navigating to: ${normalizedUrl}`);
    window.location.href = normalizedUrl;
    
    // Wait for both DOM ready and Canvas-specific elements
    await waitForCanvasPageReady();
    console.log('Navigation completed successfully');
  } catch (error) {
    console.error(`Failed to navigate to ${url}:`, error.message);
    throw error;
  }
}

async function waitForCanvasPageReady() {
  const seconds = 2;
  console.log(`Waiting ${seconds} seconds for the Canvas page to load...`);

  return new Promise(resolve => {
    console.log(`enterWaiting ${seconds} seconds for the ..`);

    let remaining = seconds;

    const interval = setInterval(() => {
      remaining--;
      console.log(`${remaining} seconds remaining`);

      if (remaining <= 0) {
        clearInterval(interval);
        console.log("Done waiting.");
        resolve(); // <-- this makes the await actually wait
      }
    }, 1000);
  });
}

async function processCourseSection(sectionType) {
  const contentData = [];
  const courseName = extractCourseName();

  console.log("Processing section: " + sectionType + " for course: " + courseName);

  switch (sectionType) {
    case 'assignments':
      contentData.push(...await extractAssignments());
      break;
    case 'quizzes':
      contentData.push(...await extractQuizzes());
      break;
    case 'pages':
      contentData.push(...extractPages());
      break;
  }

  contentData.forEach(item => {
    item.courseName = courseName;
    item.courseUrl = window.location.href.split('/').slice(0, 5).join('/');
    item.timestamp = new Date().toISOString();
  });

  console.log(`Section data for ${sectionType}:`, contentData);

  return contentData;
}

function extractCourseName() {
  const breadcrumb = document.querySelector('.ic-app-crumbs a:last-child');
  if (breadcrumb) return breadcrumb.textContent.trim();
  
  const title = document.querySelector('h1, h2');
  if (title) return title.textContent.trim();
  
  return "Unknown Course";
}

async function extractAssignments() {
  const assignments = [];
  const items = document.querySelectorAll('.assignment'); // Ensure the selector matches the DOM structure
  console.log('Woop woop Assignment start')
  if (items.length === 0) {
    console.warn("No assignment elements found on the page.");
  }

  for (const item of items) {
    const titleElement = item.querySelector('.ig-title a');
    if (!titleElement) continue;
    
    const title = titleElement.textContent.trim();
    const url = titleElement.href;
    const dueDate = item.querySelector('.assignment-date-due')?.textContent.trim() || 'No deadline';
    
    console.log(`Found assignment: ${title}, URL: ${url}, Due Date: ${dueDate}`);
    
    assignments.push({
      type: 'assignment',
      title,
      url,
      dueDate,
      content: ''
    });
  }

  if (assignments.length === 0) {
    console.warn("No assignments found.");
  }

  return assignments;
}

async function extractQuizzes() {
  const quizzes = [];
  const items = document.querySelectorAll('.quiz');
  
  for (const item of items) {
    const titleElement = item.querySelector('.ig-title a');
    if (!titleElement) continue;
    
    const title = titleElement.textContent.trim();
    const url = titleElement.href;
    const dueDate = item.querySelector('.assignment-date-due')?.textContent.trim() || 'No deadline';
    
    quizzes.push({
      type: 'quiz',
      title,
      url,
      dueDate,
      questionCount: item.querySelector('.ig-details__item')?.textContent.trim() || 'Unknown number of questions'
    });
  }
  
  return quizzes;
}

function extractPages() {
  const pages = [];
  const items = document.querySelectorAll('.wiki-page-item');
  
  for (const item of items) {
    const titleElement = item.querySelector('.wiki-page-link');
    if (!titleElement) continue;
    
    pages.push({
      type: 'page',
      title: titleElement.textContent.trim(),
      url: titleElement.href,
      lastEdited: item.querySelector('.wiki-page-link + div')?.textContent.trim() || 'Unknown edit date'
    });
  }
  
  return pages;
}

async function returnToDashboard() {
  const dashboardLink = document.querySelector('a[href="/"]');
  if (dashboardLink) {
    dashboardLink.click();
  } else {
    window.location.href = '/';
  }
  await waitForDashboard();
}

async function sendDataToServer(url, data) {
  try {
    console.log(`Sending data to server at ${url}:`, JSON.stringify(data, null, 2));
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    console.log(`Data successfully sent to ${url}`);
    return true;
  } catch (error) {
    console.error(`Could not send data to ${url}:`, error.message);
    return false;
  }
}

function extractDeadlines(htmlContent) {
  const deadlineData = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const items = doc.querySelectorAll('.PlannerItem-styles__root');
  items.forEach(item => {
    const course = item.querySelector('.css-qbjizl-text')?.textContent.trim();
    const assignment = item.querySelector('a.css-q13fpi-view-link span[aria-hidden="true"]')?.textContent.trim();
    let rawDeadlineText = item.querySelector('a.css-q13fpi-view-link span.css-1sr5vj2-screenReaderContent')?.textContent.trim();

    let formattedDeadline = 'Unknown date';
    if (rawDeadlineText?.includes("förfaller")) {
      formattedDeadline = rawDeadlineText.replace("förfaller", "").trim();
    }

    formattedDeadline = cleanDate(formattedDeadline);
    const link = item.querySelector('a')?.href;
    const fullLink = link ? `https://canvas.kth.se${link}` : '#';

    if (course || assignment || formattedDeadline || link) {
      deadlineData.push({
        course,
        assignment,
        deadline: formattedDeadline,
        link: fullLink
      });
    }
  });

  console.log(`Found ${deadlineData.length} deadlines`);
  return deadlineData;
}

function cleanDate(date) {
  if (!date) return 'Unknown date';
  let cleaned = date.trim();
  const firstCommaIndex = cleaned.indexOf(',');
  if (firstCommaIndex !== -1) cleaned = cleaned.slice(firstCommaIndex + 1).trim();
  const secondCommaIndex = cleaned.indexOf(',');
  if (secondCommaIndex !== -1) cleaned = cleaned.slice(secondCommaIndex + 1).trim();
  return cleaned;
}
