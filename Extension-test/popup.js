document.getElementById("sendData").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "fetchData" });
}); 