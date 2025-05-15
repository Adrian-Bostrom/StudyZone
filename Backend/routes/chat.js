import {requestChat} from "../OpenAI/chat.js";
import express from "express";
import path from "path";
import { readUsers } from "../website/login.js";
import { fileURLToPath } from "url";
import fs from "fs";
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logFilePath = path.join(__dirname, "..", "database", "chatlog.json");

router.post("/", async (req, res) => {

    const sessiontoken = req.body.sessiontoken;

    if(sessiontoken == undefined) {
      res.status(401).json({ error: "User not logged in"})
      return;
    }
    
    try {
      const users = await readUsers();
      let userID = users.find((user) => user.sessionToken == sessiontoken).id;

      const { message } = req.body;
      console.log("Hello")
      requestChat(message, "52615", userID)
        .then((answer) => {
          return res.json({ reply: answer });
        })
        .catch((error) => {
          console.error("Error in requestChat:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }); 
    } catch (error) {
      console.error("Error in chat route:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;