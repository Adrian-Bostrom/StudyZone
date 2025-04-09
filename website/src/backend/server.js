import express, { response } from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON requests

app.post("/api/chat", (req, res) => {
    const { message } = req.body;
    setTimeout(() => {
            let response = "this is a test response to " + message;
            res.json({reply: response});
        }, 1500);   
});

app.listen(1234, () => console.log("Server running on port 1234"));
