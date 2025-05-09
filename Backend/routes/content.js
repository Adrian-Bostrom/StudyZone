import express from "express";
import fetch from "node-fetch";
import readUsers from "../website/login.js";
import readCourses from "./courses.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function addContent(contentFilePath, course) {
  const apiUrl = `https://api.kth.se/api/kopps/v2/course/${course.courseCode}/detailedinformation`;

  console.log(`Fetching data from API for course: ${course.courseCode}, URL: ${apiUrl}`);

  fetch(apiUrl)
    .then((response) => {
      console.log(`Response received for course ${course.courseCode}:`, response.status);
      if (!response.ok) {
        throw new Error(`Failed to fetch content for course ${course.id}: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log(`Data fetched for course ${course.courseCode}:`, data);

      // Read existing content from the file
      let existingContent = [];
      if (fs.existsSync(contentFilePath)) {
        const fileData = fs.readFileSync(contentFilePath, "utf-8");
        existingContent = JSON.parse(fileData);
      }

      // Append new content
      const updatedContent = [...existingContent, ...Array.isArray(data) ? data : [data]];

      // Write updated content back to the file
      fs.writeFileSync(contentFilePath, JSON.stringify(updatedContent, null, 2));
      console.log(`Content for course ${course.courseCode} has been updated.`);
    })
    .catch((error) => {
      console.error(`Error adding content for course ${course.courseCode}:`, error.message);
    });
}

router.post("/", async (req, res) => {
  console.log("Received Data:", req.body);

  const users = await readUsers();
  let user = users.find((eachUser) => eachUser.sessionToken === req.body.userID);

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