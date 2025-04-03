(() => {
    console.log("Canvas Scraper Running...");

    function getCourseTabs() {
        let nav = document.querySelectorAll("#section-tabs")[0];
        
        let tabs = Array.from(nav.querySelectorAll("a"))
        .filter(link => link.href.includes("/courses/"))
        .map(link => ({
            title: link.innerText.trim(),
            url: link.href
        }));
        
        return tabs;
    }

    let result = {};

    result = getCourseTabs();

    let tabId = window.scraperTabId || null;

    if (!tabId) {
        console.error("scraper.js: No tabId found!");
    } else {
        console.log("Canvas Data:", result);
        chrome.runtime.sendMessage({ action: "courseData", tabId, data : result });
    }
})();
