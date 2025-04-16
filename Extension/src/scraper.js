setTimeout(() => {
    const content = document.querySelectorAll(".ic-Layout-contentMain")[0];
    
    let data = content.innerText;
    const links = Array.from(content.querySelectorAll("a"))
        .map(link => ({
        title: link.innerText.trim(),
        url: link.href
        }));

    data += "Links available on this page: " + JSON.stringify(links);
    const url = window.location.href;
  
    chrome.runtime.sendMessage({
      type: "extractedData",
      data,
      url
    });
  }, 2000);