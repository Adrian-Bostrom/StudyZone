setTimeout(() => {
    const content = document.querySelectorAll(".ic-Layout-contentMain")[0];
    
    let data = content.innerText;
    const links = Array.from(content.querySelectorAll("a"))
        .map(link => ({
        title: link.innerText.trim(),
        url: link.href
        }));
    
    const url = window.location.href;
    
    if(url.includes("/assignments") || url.includes("/quizzes")) {
        const title = document.querySelector("h1")?.innerText.trim() || "Untitled";
        let dueDate = document.querySelector(".date_text")?.innerText.trim() || "No due date";
        if (dueDate == "No due date"){
            dueDate = document.querySelector('span[data-html-tooltip-title]')?.getAttribute("data-html-tooltip-title");
        }
        const content = document.querySelector(".description")?.innerText.trim() || "No description";
        const assignmentID = window.location.href.split("/").pop(); // Gets the assignmentID from the last "/"
        const shortID = assignmentID.slice(0,6);

        chrome.runtime.sendMessage({
            type: "extractedData",
            text: data,
            links,
            url,
            id: shortID,
            title: title,
            dueDate: dueDate,
            content: content,
        });
    } else {
        chrome.runtime.sendMessage({
            type: "extractedData",
            text: data,
            links,
            url,
            document
        });
    }
}, 1);