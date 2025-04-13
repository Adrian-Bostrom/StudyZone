import express from "express";
import cors from "cors";
import path from "path";

//routes:
import loginRoute from "./routes/login.js"
import signupRoute from "./routes/signup.js"
import coursesRoute from "./routes/courses.js"
import chatRoute from "./routes/chat.js"
import logRoute from "./routes/log.js"

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/login", loginRoute);
app.use("/signup", signupRoute);
app.use("/api/courses", coursesRoute);
app.use("/chat", chatRoute); 
app.use("/log", logRoute);
app.use("/store-user", logRoute);
// Start the server depending if env variable is IP or localhost
const PORT = 5000;
if(process.env.IP){
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}else{
  app.listen(PORT, process.env.IP, () => {
    console.log(`Server running on your ip at port 5000`);
  });
}