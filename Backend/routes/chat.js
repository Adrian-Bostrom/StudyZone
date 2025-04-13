import {requestChat} from "../OpenAI/chat.js";
import express from "express";
import path from "path";
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
    const { message } = req.body;
    console.log(message);
    let readlog = readLog();
    if(message == "clear"){
      readlog = [
        {
          "role": "developer",
          "content": "You are a helpful assistant."
        }
      ];
      writeLog(readlog);
      return res.json({ reply: "Chat has been cleared!" });
    }
    else{
    requestChat(message, readlog)
      .then((chatlog) => {
        console.log(chatlog);
        let response = chatlog[chatlog.length - 1].content;
        writeLog(chatlog);
        return res.json({ reply: response });
      })
      .catch((error) => {
        console.error("Error in requestChat:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }); 
    }
  
});

export default router;