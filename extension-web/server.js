import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { createHash } from "crypto";
import { v4 as uuidv4 } from "uuid";
import {requestChat} from "../OpenAI/chat.js";
import { fileURLToPath } from "url";
import { log } from "console";
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "database", "users.json");

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

/* 
  TO DO:
  Take info from /signup and add them to a json file with encrypted passwords
  then make an id for each person so that we can have a users page

*/

// Helper function to read users from the JSON file
function readUsers() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
}

// Helper function to write users to the JSON file
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

async function addUser(username, password, email) {
  const users = readUsers();

  // Check if the username or email already exists
  if (users.some((user) => user.username == username || user.email == email)) {
    throw new Error("Username or email already exists");
  }

  // Create a new user object
  const newUser = {
    id: uuidv4(), // Generate a unique ID
    username,
    password,
    email,
  };

  // Add the new user to the list and save it
  users.push(newUser);
  writeUsers(users);

  return newUser;
}

async function login(email, password) {
  const users = readUsers();

  // Find the user by email
  const user = users.find((user) => user.email === email);
  if (!user) {
    throw new Error("User not found");
  }
  // Hash the provided password and compare it with the stored hashed password
  if (user.password == password) {
    return "200"; // Login successful
  } else {
    throw new Error("Invalid password");
  }
}

app.post("/signup", (req, res) => {
  console.log("Received Data:", req.body);
  
  const { username, password, email } = req.body; // Destructure the data from req.body

  addUser(req.body.username, req.body.password, req.body.email);
  res.send("User added");
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


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
