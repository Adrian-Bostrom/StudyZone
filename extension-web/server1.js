const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Paths
const usersFilePath = path.join(__dirname, "database", "users.json");
const assignmentsFilePath = path.join(__dirname, "database", "assignments.json"); // <-- store here

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// --------- USER FUNCTIONS --------- //

function readUsers() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

async function addUser(username, password, email) {
  const users = readUsers();

  if (users.some((user) => user.username === username || user.email === email)) {
    throw new Error("Username or email already exists");
  }

  const newUser = {
    id: uuidv4(),
    username,
    password,
    email,
  };

  users.push(newUser);
  writeUsers(users);
  return newUser;
}

async function login(email, password) {
  const users = readUsers();
  const user = users.find((user) => user.email === email);

  if (!user) throw new Error("User not found");
  if (user.password === password) return "200";
  throw new Error("Invalid password");
}

// --------- ASSIGNMENTS FUNCTIONS --------- //

function loadAssignments() {
  if (!fs.existsSync(assignmentsFilePath)) {
    fs.writeFileSync(assignmentsFilePath, JSON.stringify([]));
  }
  try {
    return JSON.parse(fs.readFileSync(assignmentsFilePath, "utf8"));
  } catch (err) {
    console.error("Error reading assignments.json:", err);
    return [];
  }
}

function saveAssignments(data) {
  try {
    fs.writeFileSync(assignmentsFilePath, JSON.stringify(data, null, 2));
    console.log("Assignments saved.");
  } catch (err) {
    console.error("Error writing to assignments.json:", err);
  }
}

// --------- ROUTES --------- //

app.post("/signup", (req, res) => {
  const { username, password, email } = req.body;

  try {
    addUser(username, password, email);
    res.send("User added");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await login(email, password);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// API route to return any JSON file from /database
app.get("/api/:variable", (req, res) => {
  const filePath = path.join(__dirname, "database", `${req.params.variable}.json`);
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) return res.status(500).json({ error: "Error reading file" });
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

// --------- NEW: LOG ASSIGNMENTS --------- //

app.post("/log", (req, res) => {
  const newData = req.body;
  let assignmentsData = loadAssignments();

  const existingCourseIndex = assignmentsData.findIndex(
    (course) => course.url === newData.url
  );

  if (existingCourseIndex !== -1) {
    assignmentsData[existingCourseIndex].assignments = newData.assignments;
  } else {
    assignmentsData.push({
      courseName: newData.title,
      url: newData.url,
      assignments: newData.assignments,
    });
  }

  saveAssignments(assignmentsData);
  res.send("Assignments saved successfully.");
});

// --------- START SERVER --------- //

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
