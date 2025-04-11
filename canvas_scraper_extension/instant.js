// ==UserScript==
// @name         Canvas Data Extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts course data from Canvas LMS and sends it to a local server
// @author       Your Name
// @match        https://canvas.kth.se/*
// @grant        none
// ==/UserScript==

(async () => {
  try {
    console.log("Starting Canvas Data Extractor...");
    await waitForDashboard();

    const jsonData = extractJSONFromScripts();
    console.log("Extracted JSON data:", jsonData);

    const favoriteCourses = extractFavoriteCourses(jsonData);
    console.log("Favorite courses:", favoriteCourses);

    if (favoriteCourses.length > 0) {
      await sendDataToServer('http://localhost:5000/favorites', favoriteCourses);

      for (const course of favoriteCourses) {
        try {
          console.log(`Processing course: ${course.name}`);
          const baseUrl = normalizeCourseUrl(course.url);

          const sections = ["assignments", "quizzes", "pages"];
          for (const section of sections) {
            const sectionUrl = `${baseUrl}/${section}`;
            console.log(`Navigating to ${section} at ${sectionUrl}`);
            await navigateToSection(sectionUrl);

            const contentData = await processCourseSection(section);
            if (contentData.length > 0) {
              await sendDataToServer(`http://localhost:5000/${section}`, contentData);
            }

            await returnToDashboard();
          }
        } catch (error) {
          console.error(`Error processing course ${course.name}:`, error);
        }
      }
    } else {
      console.log("No favorite courses found. Falling back to DOM scraping...");
      const courseUrls = await extractCourseUrls();
      for (const url of courseUrls) {
        console.log(`Processing course at ${url}`);
        await navigateToSection(url);

        const sections = ["assignments", "quizzes", "pages"];
        for (const section of sections) {
          const sectionUrl = `${normalizeCourseUrl(url)}/${section}`;
          console.log(`Navigating to ${section} at ${sectionUrl}`);
          await navigateToSection(sectionUrl);

          const contentData = await processCourseSection(section);
          if (contentData.length > 0) {
            await sendDataToServer(`http://localhost:5000/${section}`, contentData);
          }

          await returnToDashboard();
        }
      }
    }

    console.log("Data extraction completed.");
  } catch (error) {
    console.error("An error occurred during execution:", error);
  }
})();

// Helper Functions

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

function extractJSONFromScripts() {
  const jsonObjects = [];
  const scripts = document.querySelectorAll('script');

  scripts.forEach((script) => {
    if (script.src || !script.textContent.trim()) return;

    const content = script.textContent.trim();
    const extracted = extractAllJSONObjects(content);
    if (extracted.length > 0) {
      jsonObjects.push(...extracted);
    }
  });

  return jsonObjects;
}

function extractAllJSONObjects(content) {
  const objects = [];
  const jsonPattern = /{(?:[^{}]|{(?:[^{}]|{[^{}]*})*})*}/g;
  let match;

  while ((match = jsonPattern.exec(content)) !== null) {
    try {
      const jsonStr = match[0];
      if (jsonStr.length < 20) continue;

      const parsed = JSON.parse(jsonStr);
      objects.push(parsed);
    } catch (error) {
      try {
        const fixedJsonStr = fixCommonJsonIssues(match[0]);
        const parsed = JSON.parse(fixedJsonStr);
        objects.push(parsed);
      } catch (fixError) {
        console.warn("Could not parse JSON:", fixError.message);
      }
    }
  }

  return objects;
}

function fixCommonJsonIssues(jsonStr) {
  let fixed = jsonStr.replace(/([{,]\s*)([a-zA-Z_$][\w$]*)(\s*:)/g, '$1"$2"$3');
  fixed = fixed.replace(/'([^']+)'/g, '"$1"');
  fixed = fixed.replace(/,\s*([}\]])/g, '$1');
  fixed = fixed.replace(/\/\/.*$/gm, '');
  return fixed;
}

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

  return favoriteCourses;
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

function normalizeCourseUrl(url) {
  if (!url.startsWith("https://")) {
    return `https://canvas.kth.se${url}`;
  }
  return url;
}

async function navigateToSection(sectionUrl) {
  return new Promise((resolve) => {
    window.location.href = sectionUrl;

    const checkLoaded = () => {
      if (document.readyState === "complete") {
        resolve();
      } else {
        setTimeout(checkLoaded, 500);
      }
    };

    checkLoaded();
  });
}

async function returnToDashboard() {
  return navigateToSection("https://canvas.kth.se/");
}

async function processCourseSection(section) {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for DOM to load

  const items = [];

  const list = document.querySelectorAll(".ig-row, .quiz, .page") || [];
  list.forEach((item) => {
    try {
      const title = item.querySelector("a")?.innerText || "Untitled";
      const link = item.querySelector("a")?.href || "";
      items.push({ title, link });
    } catch (err) {
      console.warn("Failed to process item:", err);
    }
  });

  return items;
}

async function sendDataToServer(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Failed to send data to ${url}: ${response.statusText}`);
    }

    console.log(`Data sent successfully to ${url}`);
  } catch (error) {
    console.error("Error sending data:", error);
  }
}
