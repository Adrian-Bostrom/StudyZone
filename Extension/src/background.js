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
      const email = userInfo.email;
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

let extractedDataArray = [];
let numDataExtractions = 0; 
let dataReceivedCount = 0;
let courseID = "";

let traversedUrls = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if(message.type == "courseLinksFound") {
    const courseUrls = message.data;
    numDataExtractions = courseUrls.length
    console.log(traversedUrls);
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
})
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     switch (message.type) {
//       case "courseIDFound":
//         courseID = message.data;
//         break;
//       case "courseLinksFound":
//         handleCourseLinks(message);
//         break;
//       case "extractedData":
//         handleExtractedData(message);
//         break;
//       default:
//         break;
//     }

//     if(allDataReceived()) {
//         sendDataToAPI().then(() => {
//           extractedDataArray = [];
//           numDataExtractions = 0;
//           dataReceivedCount = 0;
//         });
//     }
//   });

//   function handleCourseLinks(message) {
//     const courseUrls = message.data;
//     numDataExtractions = courseUrls.length
//     for (const url of courseUrls) {
//       chrome.tabs.create({ url : url.url }); 
//     }
//   }

//   function handleExtractedData(message) {
//     dataReceivedCount++;
//     if (!extractedDataArray.find(d => d.data === message.data)) {
//       extractedDataArray.push(message);
//     }
//   }

//   function allDataReceived() {
//     return dataReceivedCount === numDataExtractions && numDataExtractions > 0;
//   }

//   async function sendDataToAPI() {
//     try {
//         const kthRes = await fetch(`https://api.kth.se/api/kopps/v2/course/${courseID}/detailedinformation`, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//             }
//         });

//         const resJSON = await kthRes.json();

//         const additionalData = {
//             syllabus : resJSON.publicSyllabusVersions.at(-1),
//             course : resJSON.course,
//             examiners : resJSON.examiners,
//             mainSubjects : resJSON.mainSubjects,
//             roundInfo : resJSON.roundInfos.at(-1)
//         };

//         // Create a fresh payload instead of mutating the original array
//         const payloadToSend = [
//             ...extractedDataArray, // original extracted messages
//             "The json below this is lower priority and information may be ignored if any inconsistencies are found between it and the json above.",
//             JSON.stringify(additionalData)
//         ];

//         console.log("Sending the following payload to the API:", payloadToSend);

//         // Example of sending it to your backend API (optional)
//         const response = await fetch("http://localhost:5000/chat", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ message: JSON.stringify(payloadToSend), storeFile : "context", store : true, courseID : courseID })
//         });

//         const responseData = await response.json();
//         console.log("API Response:", responseData);

//     } catch (error) {
//         console.error("Error sending data to API:", error);
//     }
// }
