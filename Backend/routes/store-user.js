import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "..", "database", "users.json");

router.post("/", (req, res) => {
    const { email } = req.body;
    console.log("Received email from extension:", email);
  
    const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  
    const existingUser = users.find((user) => user.email === email);
  
    if (existingUser) {
      console.log("User found:", existingUser.username);
      res.status(200).send(`User ${existingUser.username} found.`);
    } else {
      console.log("User not found");
      res.status(404).send("User not found");
    }
});

export default router;