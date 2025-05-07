import {requestChat} from "../OpenAI/chat.js";
import express from "express";
import path from "path";
import { readUsers } from "../website/login.js";
import { fileURLToPath } from "url";
import fs from "fs";
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "..", "database", "chatlog.json");
function readLog() {
  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(logFilePath, "utf8");
  return JSON.parse(data);
}
function writeLog(chatlog) {
  fs.writeFileSync(logFilePath, JSON.stringify(chatlog, null, 2));
}

router.post("/", (req, res) => {

    const sessiontoken = req.body.sessiontoken;

    if(sessiontoken == undefined) {
      res.status(401).json({ error: "User not logged in"})
      return;
    }
    
    const users = readUsers();
    let userID = users.find((user) => user.sessionToken == sessiontoken).id;

    const { message } = req.body;

    let readlog = readLog();
    requestChat(message, readlog, userID)
      .then((answer) => {
        return res.json({ reply: answer });
      })
      .catch((error) => {
        console.error("Error in requestChat:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }); 
  
});

export default router;