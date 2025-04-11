(async () => {
  console.log("Scraping assignments on:", window.location.href);

  // Helper to sleep for a bit (Canvas sometimes needs a moment)
  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  await sleep(1000); // Let the page fully load

  // Extract course name
  const extractCourseName = () => {
    const elements = document.querySelectorAll('span.ellipsible');
    return elements.length > 1 ? elements[1].textContent.trim() : "Unnamed Course";
  };

  const extractAssignmentLinks = () => {
    return [...document.querySelectorAll("a.ig-title")].map(a => a.href);
  };

  const extractAssignmentData = () => {
    const title = document.querySelector("h1")?.innerText.trim() || "Untitled";
    let dueDate = document.querySelector(".date_text")?.innerText.trim() || "No due date";

    if (dueDate === "No due date") {
      dueDate = document.querySelector('span[data-html-tooltip-title]')?.getAttribute("data-html-tooltip-title");
    }

    const content = document.querySelector(".description")?.innerText.trim() || "No description";
    return { title, dueDate, content, url: window.location.href };
  };

  const isOverviewPage = window.location.pathname.includes("/assignments");

  const courseName = extractCourseName();

  if (isOverviewPage) {
    const assignmentLinks = extractAssignmentLinks();

    for (const link of assignmentLinks) {
      const assignmentTab = window.open(link, "_blank");
      await new Promise(resolve => {
        const interval = setInterval(() => {
          try {
            if (assignmentTab.document && assignmentTab.document.readyState === "complete") {
              clearInterval(interval);
              resolve();
            }
          } catch {}
        }, 500);
      });

      const assignmentData = await new Promise(resolve => {
        try {
          const title = assignmentTab.document.querySelector("h1")?.innerText.trim() || "Untitled";
          let dueDate = assignmentTab.document.querySelector(".date_text")?.innerText.trim() || "No due date";
          if (dueDate === "No due date") {
            dueDate = assignmentTab.document.querySelector('span[data-html-tooltip-title]')?.getAttribute("data-html-tooltip-title");
          }
          const content = assignmentTab.document.querySelector(".description")?.innerText.trim() || "No description";
          assignmentTab.close();
          resolve({ title, dueDate, content, url: link });
        } catch {
          assignmentTab.close();
          resolve(null);
        }
      });

      if (assignmentData) {
        assignmentData.courseName = courseName;
        console.log("Sending assignment:", assignmentData);
        await fetch("http://localhost:5000/log", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assignmentData)
        });
      }
    }
  } else {
    const data = extractAssignmentData();
    data.courseName = courseName;
    console.log("Sending single assignment:", data);
    await fetch("http://localhost:5000/log", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
})();
