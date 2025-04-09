import express, { response } from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON requests

app.post("/api/chat", (req, res) => {
    const { message } = req.body;

    setTimeout(() => {
        let response = "this is a test response Lorem ipsum dolor sit amet, consectetur...";        
        res.json({ reply: response });
    }, 1500);
});

app.listen(3333, () => console.log("Server running on port 3333"));
