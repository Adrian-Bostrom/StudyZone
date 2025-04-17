import express from "express";
import readUsers from "../website/login.js";
import readCourses from "./courses.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function addContent(contentFilePath, course){
    
}

router.post("/", (req, res) => {
  console.log("Received Data:", req);
  const users = readUsers();
  // Find the user by session token
  let user = users.find((user) => user.sessiontoken == req.userID);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
    // Read the user's courses
    const courses = readCourses(user.id);
    //check if content exists
    courses.forEach(course => {
        let courseFilePath = path.join(__dirname, "..", "database", user.id, course.id);
        if (!fs.existsSync(courseFilePath)) {
            //error handle if course folder hasnt been made
            return res.status(404).json({ message: "Courses havent been created yet" });
        }
        const contentFilePath = path.join(courseFilePath, "content.js");
        if (!fs.existsSync(contentFilePath)) {
            fs.writeFileSync(contentFilePath, JSON.stringify([])); // Create file if it doesn't exist
            addContent(contentFilePath, course);
        }
    });
    //if not then make it exist and get all info from each
    return res.status(200).json(courses);
});
export default router;