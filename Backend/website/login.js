import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
// Helper function to read users from the JSON file
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const usersFilePath = path.join(__dirname, "..", "database", "users.json");
export function readUsers() {
  if (!fs.existsSync(usersFilePath)) {
    fs.writeFileSync(usersFilePath, JSON.stringify([])); // Create file if it doesn't exist
  }
  const data = fs.readFileSync(usersFilePath, "utf8");
  return JSON.parse(data);
}

// Helper function to write users to the JSON file
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

export async function addUser(username, password, email) {
  const users = readUsers();

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
    sessionToken: uuidv4()
  };

  // Add the new user to the list and save it
  users.push(newUser);
  writeUsers(users);

  return newUser;
}

export async function login(email, password) {
    const users = readUsers();
    
    // Find the user by email
    let user = users.find((user) => user.email == email);
    let ret = {
        userID: uuidv4()
    };
    //if that user doesnt exist with the same email
    if (!user) {
        ret.userID = null;
        console.log("User doesnt exist");
        return ret.userID;
    }
    if (user.password == password) {
        user.sessionToken = ret.userID;
        writeUsers(users);
        return ret.userID;
    } else {
        //if wrong password
        ret.userID = null;
        console.log("Wrong password");
        return ret.userID;
    }
    // Hash the provided password and compare it with the stored hashed password
}

export default login;