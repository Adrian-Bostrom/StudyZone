chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "SCRAPE_ASSIGNMENTS" && message.url) {
      chrome.tabs.create({ url: message.url, active: false }, (tab) => {
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scrapeAssignments.js"],
        });
      });
    }
  });
  