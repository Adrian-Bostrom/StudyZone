document.getElementById("sendData").addEventListener("click", async () => {
    try {
      // Fetch course URLs from a local JSON file
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
        const quizzesUrl = courseUrl + "/quizzes"; // Append "/quizzes" to the course URL
  
        // Navigate to the quizzes page
        chrome.tabs.update(tabId, { url: quizzesUrl });
  
        // Wait for the page to load before executing the script
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, changeInfo) {
          if (updatedTabId === tabId && changeInfo.status === "complete") {
            chrome.tabs.onUpdated.removeListener(listener); // Remove listener after execution
  
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              function: grabQuizzes
            });
  
            // Small delay before processing the next course
            setTimeout(resolve, 3000); // Adjust if needed
          }
        });
      });
    });
  }
  
  function grabQuizzes() {
    // Selecting all quizzes
    const quizzes = [...document.querySelectorAll("a.ig-title")].map(el => {
      const quizzesContainer = el.closest(".ig-row"); // Adjust if necessary
  
      // Extract due date from the <span data-html-tooltip-title="">
      const dueDateElement = quizzesContainer?.querySelector('span[data-html-tooltip-title]');
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
      quizzes: quizzes, // Store quizzes details
    };
  
    fetch("http://localhost:5000/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(response => response.text())
      .then(result => console.log("Quizzes sent:", result))
      .catch(error => console.error("Error:", error));
  }
  