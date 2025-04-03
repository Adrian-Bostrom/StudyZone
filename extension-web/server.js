import express from "express";
import cors from "cors";


const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.post("/log", (req, res) => {
  console.log("Received Data:", req.body);
  res.send("Data logged successfully");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
