import express from "express";
import { readCourses } from "./courses.js";
import path from "path";
import { fileURLToPath } from "url";
import { readUsers } from "../website/login.js";
import fs from "fs";
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readAssignments(userID) {
  const assignmentFilePath = path.join(__dirname, "..", "database", userID, "assignments.json");
  if (!fs.existsSync(assignmentFilePath)) {
    fs.writeFileSync(assignmentFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(assignmentFilePath, "utf8");
  return JSON.parse(data);
}

async function getAssIDs(userID, courseCode){

  let courses = await readCourses(userID);
  //find course ID for course code
  let course = await courses.find((course) => course.courseCode == courseCode);
  console.log("course: ", course, "userID: ", userID, "courseName: ", courseCode)
  const courseID = course.courseId;
  //get ids of assignments which are from that course
  const assFilePath = path.join(__dirname, "..", "database", userID, courseID, "courseDeadlines.json");
  let courseAssIDS = JSON.parse(fs.readFileSync(assFilePath, "utf8"));
  return courseAssIDS;
}

router.post("/", async (req, res) => {
  console.log("Received Data:", req.body);
  const users = await readUsers();
  // Find the user by session token
  console.log("users found: ",users)
  let user = await users.find((user) => user.sessionToken == req.body.userID);
  if (!user) {
    console.log("User not found", user);
    return res.status(404).json({ message: "User not found" });
  }
  else {
    // Read the user's assignment
    const asses = readAssignments(user.id);
    console.log("Assignments found:", asses);
    return res.status(200).json(asses);
  }
});

router.post("/:variable", async (req, res) => {
  const { variable } = req.params;
  console.log("Received Data:", req.body);
  const users = await readUsers();
  // Find the user by session token
  let user = users.find((user) => user.sessionToken == req.body.userID);
  try{
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    else {
      // Find assignment ids to retrieve
      let assIDs = await getAssIDs(user.id, variable);
      console.log(assIDs);
      let response = [];
      
      try{
        assIDs.forEach((assignment) => {
          const assignmentID = assignment.id;
          const asses = readAssignments(user.id);
          response.push(asses.find((ass) => ass.id == assignmentID));
        });
        return res.status(200).json(response);
      } catch{
          return res.status(400).json({message: "Assignment id not found"});
      }
    }
  }
  catch{
    return res.status(400).json({message: "User not found"}); 
  }
});
export default router;