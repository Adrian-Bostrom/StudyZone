import express, { response } from "express";
import cors from "cors";

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON requests

app.post("/api/chat", (req, res) => {
    const { message } = req.body;

    let response = "this is a test response...";

    res.json({ reply: response });
});

app.listen(5000, () => console.log("Server running on port 5000"));
