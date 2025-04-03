function scrapeAssignments() {
    console.log("Starting assignment scraping...");

    // Ensure we're on the assignments page
    if (!window.location.href.includes("/assignments")) {
        console.log("Redirecting to Assignments page...");
        window.location.href = window.location.href + "/assignments";
        return;
    }

    console.log("Scraping assignments...");

    // Find all assignment elements
    const assignments = [...document.querySelectorAll("a[href*='/assignments/']")].map(a => {
        let title = a.innerText.trim();
        
        // Remove extra content like "7 out of 8"
        title = title.split("\n")[0].trim(); 

        // Remove score patterns (e.g., "7 out of 8")
        title = title.replace(/\s*\d+(\.\d+)?\s*out\s+of\s+\d+/g, "").trim();

        // Find due date if available
        let dueDateElement = a.closest("tr")?.querySelector(".due-date-class"); // Adjust selector as needed
        let dueDate = dueDateElement ? dueDateElement.innerText.trim() : "No due date";

        return {
            title: title,
            url: a.href,
            dueDate: dueDate
        };
    });

    console.log("Scraped Assignments:", assignments);

    // Send data to backend
    fetch("http://localhost:5000/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignments }),
    })
    .then(response => response.text())
    .then(result => console.log("Data sent:", result))
    .catch(error => console.error("Error:", error));
}

// Run the script when clicking the extension button
document.getElementById("sendData").addEventListener("click", scrapeAssignments);
