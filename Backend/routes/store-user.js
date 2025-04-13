import express from "express";

const router = express.Router();

router.post("/store-user", (req, res) => {
    const { email } = req.body;
    console.log("Received email from extension:", email);
  
    const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  
    const existingUser = users.find((user) => user.email === email);
  
    if (existingUser) {
      console.log("User found:", existingUser.username);
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
      res.status(200).send(`User ${existingUser.username} found.`);
    } else {
      console.log("User not found");
      res.status(404).send("User not found");
    }
});