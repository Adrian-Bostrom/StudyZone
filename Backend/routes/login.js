import login from "../website/login.js" ;
import express from "express";
// Helper function to read users from the JSON file
const router = express.Router();

// Helper function to write users to the JSON file

router.post("/", async (req, res) => {
    console.log("Received Data:", req.body);
    
    const { email, password } = req.body; // Destructure the data from req.body

    try {
        const answer = await login(email, password); // Await the login function
        console.log("User logged in!", answer);
        const ret = {
            userID: answer // Return the sessiontoken
        };
        res.status(200).send(ret); // Send success response
    } catch (error) {
        console.log("Wrong password or email");
        res.status(400).send(error.message); // Send error response
    }
});

export default router;