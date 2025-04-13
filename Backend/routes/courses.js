import express from "express";
import readUsers from "../website/login.js";
const router = express.Router();

router.post("/", (req, res) => {
  console.log("Received Data:", req);
  const users = readUsers();
  // Find the user by email
  let user = users.find((user) => user.sessiontoken == req.userID);

});
export default router;