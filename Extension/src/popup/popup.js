document.getElementById("sendData").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Inject content script if needed (Manifest V3)
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["src/content.js"]})

  } catch (error) {
    console.error("Error fetching course URLs:", error);
  }
});
