import express from "express";
import { readCourses } from "./courses.js";
import path from "path";
import { fileURLToPath } from "url";
import { readUsers } from "../website/login.js";
import fs from "fs";
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readAssignments(userID) {
  const assignmentFilePath = path.join(__dirname, "..", "database", userID, "assignment.json");
  if (!fs.existsSync(assignmentFilePath)) {
    fs.writeFileSync(assignmentFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(assignmentFilePath, "utf8");
  return JSON.parse(data);
}

function getAssIDs(userID, courseCode){
  let courses = readCourses(userID);
  //find course ID for course code
  let course = courses.find((course) => course.courseCode == courseCode);
  const courseID = course.id;
  //get ids of assignments which are from that course
  const assFilePath = path.join(__dirname, "..", "database", userID, courseID, "courseDeadlines.json");
  let courseAssIDS = fs.readFileSync(assFilePath, "utf8");
  return courseAssIDS;
}

router.post("/", (req, res) => {
  console.log("Received Data:", req);
  const users = readUsers();
  // Find the user by session token
  let user = users.find((user) => user.sessiontoken == req.userID);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  else {
    // Read the user's assignment
    const asses = readAssignments(user.id);
    return res.status(200).json(asses);
  }
});

router.post("/:variable", (req, res) => {
  const { variable } = req.params;
  console.log("Received Data:", req, variable);
  const users = readUsers();
  // Find the user by session token
  let user = users.find((user) => user.sessiontoken == req.userID);
  try{
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    else {
      // Find assignment ids to retrieve
      let assIDs = getAssIDs(req.userID, variable);
      let response = [];
      try{
        assIDs.forEach((assignment) => {
          const assignmentID = assignment.assignmentid;
          const asses = readAssignments(req.userID);
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