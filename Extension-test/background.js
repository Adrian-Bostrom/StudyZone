chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.action === "fetchData") {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["content.js"]
            });
        });

        return true;
    }
    else if (message.action === "openCourses") { 
        message.result.courses.forEach(course =>
        {
            chrome.tabs.create({ url: course.url, active: false }, (tab) => {

                // För att skicka tabID till scraper.js, måste göras seperat genom att spara tabID i window.
                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (tabId) => {
                        window.scraperTabId = tabId;
                    },
                    args: [tab.id]
                });

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ["scraper.js"]
                });

                // Listener specific to this tab to handle course data
                const listener = function(response) {

                    if (response.action === "courseData" && response.tabId === tab.id) {
                        console.log("Scraped Data:", response.data);

                        // Process/store the scraped data here...

                        // Close the tab after processing
                        chrome.tabs.remove(tab.id);

                        chrome.runtime.onMessage.removeListener(listener);
                    }
                };

                chrome.runtime.onMessage.addListener(listener);

            })
        });
    }
});
