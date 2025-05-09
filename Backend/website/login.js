import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Helper function to read users from the JSON file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "..", "database", "users.json");

async function readUsers() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }

  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    const users = JSON.parse(data);

    // Ensure the parsed data is an array
    if (Array.isArray(users)) {
      return users;
    } else {
      console.error("Invalid users data format. Resetting to an empty array.");
      return [];
    }
  } catch (error) {
    console.error("Error reading or parsing users file. Resetting to an empty array.", error);
    return [];
  }
}

// Helper function to write users to the JSON file
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

async function addUser(username, password, email) {
  const users = await readUsers();

  // Check if the username or email already exists
  if (users.some((user) => user.username == username || user.email == email)) {
    console.log("Username or email already exists");
    return null;
  }

  // Create a new user object
  const newUser = {
    id: uuidv4(), // Generate a unique ID
    username,
    password,
    email,
    sessionToken: uuidv4(),
  };

  // Add the new user to the list and save it
  users.push(newUser);
  writeUsers(users);

  return newUser;
}

async function login(email, password) {
  console.log("Login function called with:", email, password);
  return new Promise(async (resolve, reject) => {
    const users = await readUsers(); // Read the users from the file
    console.log("Users:", users); // Debugging log to verify users

    // Find the user by email
    const user = users.find((user) => user.email === email);
    if (!user) {
      console.log("Email not found");
      return reject(new Error("User doesn't exist or wrong password"));
    }

    // Validate the password
    if (user.password !== password) {
      console.log("Incorrect password");
      return reject(new Error("User doesn't exist or wrong password"));
    }

    // If email and password match, resolve with the session token
    console.log("User authenticated successfully:", user);
    resolve(user.sessionToken);
  });
}

export {login, addUser, writeUsers, readUsers};
export default login;