setTimeout(() => {
    const content = document.querySelectorAll(".ic-Layout-contentMain")[0];
    const courseID = document.title.split(" ")[0];
    
    let data = content.innerText;
    const links = Array.from(content.querySelectorAll("a"))
        .map(link => ({
        title: link.innerText.trim(),
        url: link.href
        }));
    
    const url = window.location.href;
    
    chrome.runtime.sendMessage({
        type: "extractedData",
        text: data,
        links,
        url
    });
}, 1);