import express from "express";
import readUsers from "../website/login.js";
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readCourses(userID) {
  const courseFilePath = path.join(__dirname, "..", "database", userID, "courses.json");
  if (!fs.existsSync(courseFilePath)) {
    fs.writeFileSync(courseFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
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
    // Read the user's courses
    const courses = readCourses(user.id);
    return res.status(200).json(courses);
  }
});
export default router;