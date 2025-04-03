const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { createHash } = require('crypto');
const { v4: uuidv4 } = require("uuid");

const app = express();

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

// Add a new user
async function hash(string) {
  return createHash('sha256').update(string).digest('hex');
}

async function addUser(username, password, email) {
  const users = readUsers();

  // Check if the username or email already exists
  if (users.some((user) => user.username === username || user.email === email)) {
    throw new Error("Username or email already exists");
  }

  // Hash the password
  const hashedPassword = await hash(password);

  // Create a new user object
  const newUser = {
    id: uuidv4(), // Generate a unique ID
    username,
    password: hashedPassword,
    email,
  };

  // Add the new user to the list and save it
  users.push(newUser);
  writeUsers(users);

  return newUser;
}
async function login(email, password) {
  const users = readUsers();
  // Check if the username or email already exists
  if (users.some((user) => user.email === email && user.password === hash(password))) {
    return true;
  }
  else return false;
}

app.post("/signup", (req, res) => {
  console.log("Received Data:", req.body);
  
  const { username, password, email } = req.body; // Destructure the data from req.body

  addUser(req.body.username, req.body.password, req.body.email);
  res.send("User added");
});

app.post("/login", (req, res) => {
  console.log("Received Data:", req.body);
  
  const { email, password } = req.body; // Destructure the data from req.body

  let answer = login(req.body.email, req.body.password);
  res.send(answer? "200" : "400");
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
