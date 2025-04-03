document.getElementById("sendData").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    //const assignmentsUrl = "https://canvas.kth.se/courses/52615/modules";
    const assignmentsUrl = tabs[0].url + "/modules";

    // Navigate to the assignments page
    chrome.tabs.update(tabId, { url: assignmentsUrl });

    // Wait for the page to load before executing the script
    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
      if (updatedTabId === tabId && changeInfo.status === "complete") {
        chrome.tabs.onUpdated.removeListener(listener); // Remove listener after execution

        // Delay script execution slightly to ensure elements are loaded
        setTimeout(() => {
          chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: grabAssignments
          });
        }, 2000); // Adjust delay if needed
      }
    });
  });
});

function grabAssignments() {
  // Select all assignment rows
  const assignments = [...document.querySelectorAll(".ig-row")].map(row => {
    const titleElement = row.querySelector("a.ig-title");
    const dueDateElement = row.querySelector(".due_date_display");
    const pointsElement = row.querySelector(".points_possible_display");

    return {
      title: titleElement ? titleElement.innerText.trim() : "No title",
      link: titleElement ? titleElement.href : "#",
      dueDate: dueDateElement ? dueDateElement.innerText.trim() : "No due date",
      points: pointsElement ? pointsElement.innerText.trim() : "No points info",
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
