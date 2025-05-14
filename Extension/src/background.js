let email;

chrome.identity.getAuthToken({ interactive: true }, (token) => {
  if (chrome.runtime.lastError) {
    console.error("Auth error:", chrome.runtime.lastError);
    return;
  }

  fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(userInfo => {
      console.log("User email:", userInfo.email);
      email = userInfo.email;
      sendUserInfoToServer(email);
      // Now you can send this to your server
    });
});

function sendUserInfoToServer(email) {
  const userInfo = { email }; // wrap it in an object

  fetch("http://localhost:5000/store-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userInfo)
  })
    .then(res => res.text())
    .then(result => console.log("User info stored:", result))
    .catch(err => console.error("Error sending user info:", err));
}

function storePageDataToServer(email, course, data, url) {
  const userInfo = { email }; // wrap it in an object

  fetch("http://localhost:5000/store-data", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({email : userInfo, data, course, url})
  })
    .then(res => res.text())
    .then(result => console.log("Data stored:", result))
    .catch(err => console.error("Error storing data:", err));
}

let extractedDataArray = [];
let numDataExtractions = 0; 
let dataReceivedCount = 0;
let courseID = "";

let traversedUrls = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type == "courseIDFound") {
    courseID = message.data;
  } else if(message.type == "courseLinksFound") {
    const courseUrls = message.data;
    numDataExtractions = courseUrls.length

    for (const url of courseUrls) {
      traversedUrls.push(url.url);
      chrome.tabs.create({ url: url.url }, (tab) => {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["./src/scraper.js"]
          });
      });
    }
  } else if(message.type == "extractedData") {

    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id);
    }

    storePageDataToServer(email, courseID, message.text, message.url);

    if(message.url.includes("assignments/")) {
      const assignmentData = message;
      assignmentData.courseName = courseID;
      assignmentData.courseCode = "courseCode";
      assignmentData.email = email;
      
      console.log(assignmentData);

      fetch("http://localhost:5000/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentData),
      })
        .then(res => res.text())
        .then(result => console.log("Logged assignment:", result))
        .catch(err => console.error("Error logging assignment:", err));
    }

    const urls = message.links;
    
    setTimeout(() => {
      for (const url of urls) {
        if(!traversedUrls.includes(url.url)) {
          console.log(url.url);
          if(!url.url.includes("canvas")) {continue};
          traversedUrls.push(url.url);
          chrome.tabs.create({ url: url.url }, (tab) => {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ["./src/scraper.js"]
            });
        });
        }
      }
    }, 1);
  }
});