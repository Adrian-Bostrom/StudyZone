(() => {
    console.log("Canvas Scraper Running...");

    function getCourseList() {
        let courses = Array.from(document.querySelectorAll("a"))
            .filter(link => link.href.includes("/courses/"))
            .map(link => ({
                title: link.innerText.trim(),
                url: link.href
            }));
        return courses;
    }

    let result = {};

    result.courses = getCourseList();

    console.log("Canvas Data:", result);
    chrome.runtime.sendMessage({ action: "openCourses", result });
})();
