document.getElementById("sendData").addEventListener("click", async () => {
  chrome.identity.getAuthToken({ interactive: true }, async (token) => {
    if (chrome.runtime.lastError) {
      console.error("Auth error:", chrome.runtime.lastError);
      return;
    }

    const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.json());

    const email = userInfo.email;
    console.log("User email:", email);

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tabId = tabs[0].id;

      chrome.tabs.update(tabId, { url: "https://canvas.kth.se/" });

      chrome.tabs.onUpdated.addListener(function dashboardListener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(dashboardListener);

          // Extract course links from the homepage
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
              const baseUrl = "https://canvas.kth.se";
              const courseLinks = Array.from(document.querySelectorAll('a.ic-DashboardCard__link[href^="/courses/"]'))
                .map(a => baseUrl + a.getAttribute("href"));
              return [...new Set(courseLinks)]; // Remove duplicates here already
            }
          }, async (results) => {
            const courseUrls = results[0].result;
            console.log("Extracted course URLs:", courseUrls);

            // Extract course name from the homepage after extracting course links
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              func: () => {
                // Modify the selector to match the element(s) that contain the course names
                const courseNames = Array.from(document.querySelectorAll('h2.ic-DashboardCard__header-title.ellipsis'))
                  .map(h2 => h2.textContent.trim());  // Extract the text content of the course name
                return [...new Set(courseNames)];  // Remove duplicates if needed
              }
            }, async (results) => {
              const courseNames = results[0].result;
              console.log(courseNames);
              console.log("Extracted course names:", courseNames);
              // Use the extracted course URLs and course name
              let i = 0;
              for (const courseUrl of courseUrls) {
                let courseName = courseNames[i];
                let words = courseName.split(" "); // Split the sentence by spaces
                let courseCode = words[0];
                await processCourse(courseUrl, courseName, courseCode, email);  // Pass the courseName to the processCourse function
                i++;
              }
            });
          });
        }
      });
    });
  });
});

async function processCourse(courseUrl, courseName, courseCode, email) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      const assignmentsUrl = courseUrl + "/assignments";

      chrome.tabs.update(tabId, { url: assignmentsUrl });

      chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          // Removed the part that extracts the course name
          // Instead, directly extract the assignment links
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: extractAssignmentLinks
          }, async (injectionResults) => {
            const links = injectionResults[0].result;

            // Since we no longer have the courseName, we can skip passing it to visitAssignmentPage
            for (const link of links) {
              await visitAssignmentPage(tabId, link, courseName, courseCode, email);  // Now only passing email
            }

            setTimeout(resolve, 1000);
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
async function visitAssignmentPage(tabId, link, courseName, courseCode, email) {
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
          assignmentData.courseCode = courseCode;
          assignmentData.email = email; // Attach email

          fetch("http://localhost:5000/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignmentData),
          })
            .then(res => res.text())
            .then(result => console.log("Logged assignment:", result))
            .catch(err => console.error("Error logging assignment:", err));

          setTimeout(resolve, 1000);
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
  const assignmentID = window.location.href.split("/").pop(); // Gets the assignmentID from the last "/"


  return {
    url: window.location.href,
    id: assignmentID,
    title: title,
    dueDate: dueDate,
    content: content,
  };
}