const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const FILE_PATH = "assignments.json"; // File where assignments will be stored

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Load existing assignments or initialize an empty array
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

// Handle incoming assignment data
app.post("/log", (req, res) => {
  const newData = req.body; // Data from Chrome extension
  let assignmentsData = loadAssignments();

  // Check if the course already exists
  const existingCourseIndex = assignmentsData.findIndex(
    (course) => course.url === newData.url
  );

  if (existingCourseIndex !== -1) {
    // If course exists, update assignments
    assignmentsData[existingCourseIndex].assignments = newData.assignments;
  } else {
    // If course is new, add it
    assignmentsData.push({
      courseName: newData.title, // Use page title as course name
      url: newData.url,
      assignments: newData.assignments,
    });
  }

  // Save the updated data
  saveAssignments(assignmentsData);
  res.send("Assignments saved successfully.");
});

// Start the server
const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
