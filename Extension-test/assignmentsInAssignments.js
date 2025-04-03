document.getElementById("sendData").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    //const assignmentsUrl = "https://canvas.kth.se/courses/53175/assignments";
    const assignmentsUrl = tabs[0].url + "/assignments";

    // Navigate to the assignments page
    chrome.tabs.update(tabId, { url: assignmentsUrl });

    // Wait for the page to load before executing the script
    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener); // Remove listener after execution
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: grabAssignments
        });
      }
    });
  });
});

function grabAssignments() {
  // Selecting all assignments
  const assignments = [...document.querySelectorAll("a.ig-title")].map(el => {
    const assignmentContainer = el.closest(".ig-row"); // Adjust if necessary
    
    // Extract due date from the <span data-html-tooltip-title="">
    const dueDateElement = assignmentContainer?.querySelector('span[data-html-tooltip-title]');
    const dueDate = dueDateElement ? dueDateElement.getAttribute("data-html-tooltip-title").trim() : "No due date";

    return {
      title: el.innerText.trim(),
      link: el.href,
      dueDate: dueDate, // Extracted from the tooltip
    };
  });

  const data = {
    url: window.location.href,
    title: document.title,
    assignments: assignments, // Store assignment details
  };

  fetch("http://localhost:5000/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(response => response.text())
    .then(result => console.log("Assignments sent:", result))
    .catch(error => console.error("Error:", error));
}
