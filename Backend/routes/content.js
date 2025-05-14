import express from "express";
import fetch from "node-fetch";
import readUsers from "../website/login.js";
import readCourses from "./courses.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

router.post("/", (req, res) => {
  console.log("Received Data:", req);
  const users = readUsers();
  // Find the user by session token
  let user = users.find((user) => user.sessiontoken == req.userID);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log("User found:", user);
  const courses = readCourses(user.id);
  console.log("Courses found:", courses);

  try {
    // Process each course asynchronously
    await Promise.all(
      courses.map(async (course) => {
        let courseFilePath = path.join(__dirname, "..", "database", user.id, course.courseId);
        if (!fs.existsSync(courseFilePath)) {
          throw new Error(`Course ${course.courseId} hasn't been created yet`);
        }
        const contentFilePath = path.join(courseFilePath, "content.json");
        if (!fs.existsSync(contentFilePath)) {
          fs.writeFileSync(contentFilePath, JSON.stringify([])); // Create file if it doesn't exist
        }
        addContent(contentFilePath, course); // Wait for addContent to complete
      })
    );
    return res.status(200).json("Courses added successfully");
  } catch (error) {
    console.error("Error processing courses:", error.message);
    return res.status(500).json({ message: error.message });
  }
});

router.post("/:variable", async (req, res) => {
  console.log("Received Data:", req.body);

  const users = await readUsers();
  let user = users.find((eachUser) => eachUser.sessionToken === req.body.userID);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  console.log("User found:", user);
  const courses = readCourses(user.id);
  console.log("Courses found:", courses);

  const { variable } = req.params;
});

export default router;

/*
Content är uppdelad av gpt i delar, som sparas som en array i content.json
och som sedan kan användas för att visa innehållet i frontend.

content endpointen returnerar bara en lista av delar
content/id endpointen returnerar resten av innehållet
*/