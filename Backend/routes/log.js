import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
let FILE_PATH = "./database";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "..", "database", "users.json");
const router = express.Router();

// Save assignments to the JSON file
const saveAssignments = (data, userid) => {
    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
      console.log("Assignments saved successfully.");
      extractSpecificParts(userid);
    } catch (err) {
      console.error("Error saving assignments:", err);
    }
};

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

function extractSpecificParts(userID) {
  const assignmentsData = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'));

  const coursesOnly = assignmentsData.map(course => {
    const courseId = course.url.split("/").pop();
    return {
      courseId: courseId,
      courseName: course.courseName,
      courseCode: course.courseCode,
      description: "No description added yet",
      courseUrl: course.url
    };
  });

  const userFolder = path.join(__dirname, "..", "database", userID);
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }

  let allUserAssignments = [];

  coursesOnly.forEach(course => {
    const courseFolder = path.join(userFolder, course.courseId);
    if (!fs.existsSync(courseFolder)) {
      fs.mkdirSync(courseFolder, { recursive: true });
    }

    const assignmentsForCourse =
      assignmentsData.find(courseData => courseData.url === course.courseUrl)?.assignments || [];

    // Append to the global array
    allUserAssignments.push(...assignmentsForCourse);

    const id = assignmentsForCourse.map(assignment => {
      return {
        id: assignment.id
      };
    });

    const assignmentsFilePath = path.join(courseFolder, "courseDeadlines.json"); //course deadline ids
    const courseFilePath = path.join(userFolder, "courses.json");

    fs.writeFileSync(assignmentsFilePath, JSON.stringify(id, null, 2));
    fs.writeFileSync(courseFilePath, JSON.stringify(coursesOnly, null, 2));

    console.log(`Assignments for course ${course.courseName} saved to ${assignmentsFilePath}`);
    console.log(`Courses saved to ${courseFilePath}`);
  });

  // Write all user assignments at once
  const allAssignmentsFilePath = path.join(userFolder, "assignments.json");
  fs.writeFileSync(allAssignmentsFilePath, JSON.stringify(allUserAssignments, null, 2));
  console.log(`All user assignments saved to ${allAssignmentsFilePath}`);
}

  
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

router.post("/", (req, res) => {
    console.log("Received Data:", req.body);
    const { url, title, id, dueDate, content, courseName, email, courseCode } = req.body;

    // Skip saving if access is denied
    if (title === "Access denied" || title === "Untitled") {
      console.log("Access denied assignment detected. Skipping save.");
      return res.status(200).send("Access denied assignment was not saved.");
    }
  
    const match = url.match(/(https:\/\/canvas\.kth\.se\/courses\/\d+)/);
    if (!match) {
      return res.status(400).send("Invalid assignment URL format");
    }
    const userid = getUserIdByEmail(email);
    FILE_PATH =  "./database/" + userid + "/courseAndAssignments.json"
  
    const courseUrl = match[1];
    const assignmentEntry = {
      title,
      id,
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
  
      // Normalize link (remove query/hash if needed)
    const normalizedUrl = url.split(/[?#]/)[0];

    const isDuplicate = course.assignments.some(a => 
      a.id === id || a.link.split(/[?#]/)[0] === normalizedUrl
    );

    if (!isDuplicate) {
      course.assignments.push(assignmentEntry);
    }

    } else {
      assignmentsData.push({
        courseName,
        courseCode,
        url: courseUrl,
        email,
        assignments: [assignmentEntry],
      });
    }
    console.log(assignmentsData[0].email);
    saveAssignments(assignmentsData, userid);
    res.send("Assignment saved successfully.");
  });

  export default router;