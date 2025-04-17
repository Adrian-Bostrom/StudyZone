import {addUser} from "../website/login.js";
import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const router = express.Router();

router.post("/", async (req, res) => {
    console.log("Received Data:", req.body);

    const { username, password, email } = req.body;

    try {
        const user = await addUser(username, password, email); // Call addUser
        const ret = {
            userID: user.sessionToken, // Return the sessiontoken
        };
        const __dirname = path.dirname(fileURLToPath(import.meta.url));
        const userFolderPath = path.join(__dirname,"..", "database", user.id);
        if (!fs.existsSync(userFolderPath)) {
            fs.mkdirSync(userFolderPath, { recursive: true });
        }
        console.log("created user:", user);
        res.status(200).send(ret); // Send the response
    } catch (error) {
        console.error("Error during signup:", error.message);
        res.status(400).send({ error: error.message }); // Handle errors
    }
});

export default router;