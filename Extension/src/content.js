const banlist = ["grade", "people", "users", "user", "grades", "discussion", "discuss", "evaluation", "announcement", "file"]

if (window.location.pathname.includes("/courses/")) {
    const nav = document.querySelector("#section-tabs");
    const courseID = document.title.split(" ")[0];
    chrome.runtime.sendMessage({type : "courseIDFound", data : courseID});

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
  