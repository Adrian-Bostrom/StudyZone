import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "..", "database", "users.json");
let FILE_PATH = "./database";

function purifyURL(url) {
    let cleanUrl = url.replace(/^https?:\/\//, '');
    cleanUrl = cleanUrl.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
    if(cleanUrl.length > 100) {
        cleanUrl.slice(0,100);
    }
    return cleanUrl;
}

router.post("/", (req, res) => {
    const { email } = req.body.email;
    const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
    const existingUser = users.find((user) => user.email === email);
  
    const fileFolder = path.join(
        __dirname,
        "..",
        "database",
        existingUser.id,
        req.body.course,
        "context",
        "files"
      );
    
    if (existingUser) {
      fs.mkdirSync(fileFolder, { recursive: true });
      fs.writeFileSync(fileFolder + "/" + purifyURL(req.body.url) + ".txt", JSON.stringify(req.body.data, null, 2));
      res.status(200).send(`Stored data for course: ${req.body.course}, for user: ${existingUser.username}`);
    } else {
      res.status(404).send("User not found");
    }
});

export default router;