import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import { readUsers } from "../website/login.js";
import fs from "fs";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readCourses(userID) {
  const courseFilePath = path.join(__dirname, "..", "database", userID, "course.json");
  try {
    if (!fs.existsSync(courseFilePath)) {
      fs.writeFileSync(courseFilePath, JSON.stringify([])); // Create file if it doesn't exist
    }

    const data = fs.readFileSync(courseFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading or writing courses file:", error);
    return []; // Return an empty array as a fallback
  }
}

router.post("/", async (req, res) => {
  console.log("Received Data:", req.body);
  const users = await readUsers();
  // Find the user by session token
  console.log("Users data:", users); 
  let user = users.find((user) => user.sessiontoken == req.body.userID);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  else {
    // Read the user's courses
    const courses = await readCourses(user.id);
    return res.status(200).json(courses);
  }
});

router.post("/:variable", (req, res) => {
  const { variable } = req.params;
  console.log("Received Data:", variable);
  const users = readUsers();
  // Find the user by session token
  let user = users.find((user) => user.sessiontoken == req.userID);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  else {
    // Read the user's course
    const courses = readCourses(user.id);
    let course = courses.find((course) => course.courseCode == variable);
    return res.status(200).json(course);
  }
});

export {readCourses};
export default router;