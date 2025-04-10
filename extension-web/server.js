import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";
import {requestChat} from "../OpenAI/chat.js";
import { fileURLToPath } from "url";
import { log } from "console";
import {addUser} from "./login.js";
import {login} from "./login.js";
const app = express();
const FILE_PATH = "assignments.json"; // File where assignments will be stored
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "database", "users.json");
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/signup", (req, res) => {
  console.log("Received Data:", req.body);
  
  const { username, password, email } = req.body; // Destructure the data from req.body

  const user = addUser(req.body.username, req.body.password, req.body.email);
  let ret = {
    userID: user.sessiontoken
  };
});
app.post("/api/courses", (req, res) => {
  console.log("Received Data:", req);
  const users = readUsers();
  // Find the user by email
  let user = users.find((user) => user.sessiontoken == req.userID);

});

app.post("/login", async (req, res) => {
  console.log("Received Data:", req.body);

  const { email, password } = req.body; // Destructure the data from req.body

  try {
    const answer = await login(email, password); // Await the login function
    console.log("User logged in!");
    res.status(200).send(answer); // Send success response
  } catch (error) {
    console.log("Wrong password or email");
    res.status(400).send(error.message); // Send error response
  }
  
});

// Handle any request to /api/:variable
app.get("/api/:variable", (req, res) => {
  const variable = req.params.variable; // Extract the dynamic part of the URL
  console.log("Received variable:", variable);
  // Example: Use the variable to construct a file path
  const filePath = path.join(__dirname, "database", `${variable}.json`);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading file" });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data); // Send JSON file contents
  });
});
// Load existing assignments or initialize empty array
const loadAssignments = () => {
  if (fs.existsSync(FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    } catch (err) {
      console.error("Error reading JSON file:", err);
      return [];
    }
  }
  return [];
};

// Save assignments to the JSON file
const saveAssignments = (data) => {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    console.log("Assignments saved successfully.");
  } catch (err) {
    console.error("Error saving assignments:", err);
  }
};

app.post("/store-user", (req, res) => {
  const { email } = req.body;
  console.log("Received email from extension:", email);

  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    console.log("User found:", existingUser.username);
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
    res.status(200).send(`User ${existingUser.username} found.`);
  } else {
    console.log("User not found");
    res.status(404).send("User not found");
  }
});

function getUserIdByEmail(email) {
  try {
    // Read the users.json file
    const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));

    // Find the user by email
    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      console.log("User found:", existingUser.username);
      return existingUser.id; // Return the userID of the found user
    } else {
      console.log("User not found");
      return null; // Return null if user is not found
    }
  } catch (error) {
    console.error("Error reading users file:", error);
    return null; // In case of an error, return null
  }
}



// Handle individual assignment submission
app.post("/log", (req, res) => {
  const { url, title, dueDate, content, courseName, email } = req.body;

  const match = url.match(/(https:\/\/canvas\.kth\.se\/courses\/\d+)/);
  if (!match) {
    return res.status(400).send("Invalid assignment URL format");
  }

  const courseUrl = match[1];
  const assignmentEntry = {
    title,
    link: url,
    dueDate,
    content,
  };

  let assignmentsData = loadAssignments();

  const courseIndex = assignmentsData.findIndex(
    (course) => course.url === courseUrl && course.email === email
  );

  if (courseIndex !== -1) {
    const course = assignmentsData[courseIndex];

    const existingAssignmentIndex = course.assignments.findIndex((a) => a.link === url);
    if (existingAssignmentIndex !== -1) {
      course.assignments[existingAssignmentIndex] = assignmentEntry;
    } else {
      course.assignments.push(assignmentEntry);
    }
  } else {
    assignmentsData.push({
      courseName,
      url: courseUrl,
      email,
      assignments: [assignmentEntry],
    });
  }
  console.log(assignmentsData[0].email);
  console.log(getUserIdByEmail(assignmentsData[0].email));
  saveAssignments(assignmentsData);
  res.send("Assignment saved successfully.");
});

// Start the server
const logFilePath = path.join(__dirname, "database", "chatlog.json");
function readLog() {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(logFilePath, "utf8");
  return JSON.parse(data);
}
function writeLog(chatlog) {
  fs.writeFileSync(logFilePath, JSON.stringify(chatlog, null, 2));
}
app.post("/chat", (req, res) => {
  const { message } = req.body;
  console.log(message);
  let readlog;
  if(message == "clear"){
    readlog = [
      {
        "role": "developer",
        "content": "You are a helpful assistant."
      }
    ];
    writeLog(readlog);
    res.json({ reply: "Chat has been cleared!" });
  }
  else{readlog = readLog();
  requestChat(message, readlog)
    .then((chatlog) => {
      console.log(chatlog);
      let response = chatlog[chatlog.length - 1].content;
      res.json({ reply: response });
      writeLog(chatlog);
    })
    .catch((error) => {
      console.error("Error in requestChat:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }); 
  }

});


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.post("/api/:variable", (req, res) => {
  const variable = req.params.variable;
  
})