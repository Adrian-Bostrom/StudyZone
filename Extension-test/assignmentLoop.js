document.getElementById("sendData").addEventListener("click", async () => {
  try {
    const response = await fetch("urls.json");
    const courses = await response.json();

    for (const courseUrl of courses) {
      await processCourse(courseUrl);
    }
  } catch (error) {
    console.error("Error fetching course URLs:", error);
  }
});

async function processCourse(courseUrl) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      const assignmentsUrl = courseUrl + "/assignments";

      chrome.tabs.update(tabId, { url: assignmentsUrl });

      chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          // First extract the course name from assignments page
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: extractCourseName,
          }, async (nameResult) => {
            const courseName = nameResult[0].result;

            // Now extract assignment links
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: extractAssignmentLinks
            }, async (injectionResults) => {
              const links = injectionResults[0].result;

              for (const link of links) {
                await visitAssignmentPage(tabId, link, courseName);
              }

              setTimeout(resolve, 1000);
            });
          });
        }
      });
    });
  });
}


// Extract assignment links from the /assignments page
function extractAssignmentLinks() {
  return [...document.querySelectorAll("a.ig-title")].map(a => a.href);
}

// Visit each assignment page and extract info
async function visitAssignmentPage(tabId, link, courseName) {
  return new Promise((resolve) => {
    chrome.tabs.update(tabId, { url: link });

    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener);

        chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: scrapeAssignmentDetails
        }, (results) => {
          const assignmentData = results[0].result;
          assignmentData.courseName = courseName;

          fetch("http://localhost:5000/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignmentData),
          })
            .then(res => res.text())
            .then(result => console.log("Logged assignment:", result))
            .catch(err => console.error("Error logging assignment:", err));

          setTimeout(resolve, 1000); // Delay to avoid race conditions
        });
      }
    });
  });
}

// Scrape info from individual assignment page
function scrapeAssignmentDetails() {
  const title = document.querySelector("h1")?.innerText.trim() || "Untitled";
  let dueDate = document.querySelector(".date_text")?.innerText.trim() || "No due date";
  if (dueDate == "No due date"){
    dueDate = document.querySelector('span[data-html-tooltip-title]')?.getAttribute("data-html-tooltip-title");
  }
  const content = document.querySelector(".description")?.innerText.trim() || "No description";

  return {
    url: window.location.href,
    title: title,
    dueDate: dueDate,
    content: content,
  };
}

function extractCourseName() {
  const elements = document.querySelectorAll('span.ellipsible');
  const courseName = elements[1]; // Access the second element (index 1)
  return courseName.textContent; // Return only the text content
  
}


