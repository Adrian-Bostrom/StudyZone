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
  
  

  
  