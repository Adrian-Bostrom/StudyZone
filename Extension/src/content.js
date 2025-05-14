const banlist = ["grade", "people", "users", "user", "grades", "discussion", "discuss", "evaluation", "announcement", "file", "anslag", "rubric"]

if (window.location.pathname.includes("/courses/")) {
    const nav = document.querySelector("#section-tabs");
    const courseID = window.location.href.split("/").pop(); // Gets the courseID from the last "/"
    // const courseName = document.title.split(" ")[0];
    const courseName = document.title;
    chrome.runtime.sendMessage({type : "courseIDFound", data : courseID, name : courseName});

    if (nav) {
      const links = Array.from(nav.querySelectorAll("a"))
        .filter(link => link.href.includes("/courses/") && !banlist.some(banned => link.href.includes(banned)))
        .map(link => ({
          title: link.innerText.trim(),
          url: link.href
        }));
  
      chrome.runtime.sendMessage({ type: "courseLinksFound", data: links });
    }
  }
  