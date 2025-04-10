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
  const userCourses = path.join(__dirname, "database", user.id);
  fs.mkdir(dirpath, { recursive: true })
  res.send(ret);
  
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