document.getElementById("sendData").addEventListener("click", async () => {
  try {
    // Fetch course URLs from a JSON file
    const response = await fetch("urls.json");
    const courses = await response.json(); // Assuming JSON is an array of course URLs

    for (const courseUrl of courses) {
      await processCourse(courseUrl); // Process each course sequentially
    }
  } catch (error) {
    console.error("Error fetching course URLs:", error);
  }
});

async function processCourse(courseUrl) {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      const assignmentsUrl = courseUrl + "/assignments"; // Navigate to assignments page

      chrome.tabs.update(tabId, { url: assignmentsUrl });

      chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
        if (updatedTabId === tabId && changeInfo.status === "complete") {
          chrome.tabs.onUpdated.removeListener(listener);

          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: grabAssignments
          });

          // Delay before moving to the next course
          setTimeout(resolve, 5000); 
        }
      });
    });
  });
}

function grabAssignments() {
  const assignments = [...document.querySelectorAll("a.ig-title")].map(el => {
    const assignmentContainer = el.closest(".ig-row");

    // Extract due date from <span data-html-tooltip-title="">
    const dueDateElement = assignmentContainer?.querySelector('span[data-html-tooltip-title]');
    const dueDate = dueDateElement ? dueDateElement.getAttribute("data-html-tooltip-title").trim() : "No due date";

    return {
      title: el.innerText.trim(),
      link: el.href,
      dueDate: dueDate,
    };
  });

  const data = {
    url: window.location.href,
    title: document.title,
    assignments: assignments,
  };

  fetch("http://localhost:5000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(response => response.text())
    .then(async response => {
      const text = await response.text();
      console.log("Response from server:", text);
    })
    
}