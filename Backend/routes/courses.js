import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import { readUsers } from "../website/login.js";
import fs from "fs";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function readCourses(userID) {
  const courseFilePath = path.join(__dirname, "..", "database", userID, "courses.json");
  if (!fs.existsSync(courseFilePath)) {
    fs.writeFileSync(courseFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(courseFilePath, "utf8");
  return JSON.parse(data);
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
export default router;