import express from "express";
const router = express.Router();

// Save assignments to the JSON file
const saveAssignments = (data, userid) => {
    try {
      fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
      console.log("Assignments saved successfully.");
      extractSpecificParts(userid);
    } catch (err) {
      console.error("Error saving assignments:", err);
    }
};

// Load existing assignments or initialize empty array
const loadAssignments = () => {
  if (fs.existsSync(FILE_PATH)) {
    try {
      return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    } catch (err) {
      console.error("Error reading JSON file:", err);
      return [];
    }
  }
  return [];
};

function extractSpecificParts(userID) {
    // Read the original assignments data from the file
    const assignmentsData = JSON.parse(fs.readFileSync('assignments.json', 'utf8'));
    // Extract courses only
    const coursesOnly = assignmentsData.map(course => {
      const courseId = course.url.split("/").pop(); // Extract course ID from URL
      return {
        courseId: courseId,
        courseName: course.courseName,
        courseUrl: course.url
      };
    });
  
    // Define the folder path for the user (using userID)
    const userFolder = path.join(__dirname, 'database', userID);
    // Loop through each course
    coursesOnly.forEach(course => {
      const courseFolder = path.join(userFolder, course.courseId);
      // Ensure the folder exists, create it if necessary
      if (!fs.existsSync(courseFolder)) {
        fs.mkdirSync(courseFolder, { recursive: true });
      }
      // Filter assignments for this specific course
      const assignmentsForCourse = assignmentsData.find(courseData => courseData.url === course.courseUrl)?.assignments || [];
      // Define the file path to save the assignments.json file
      const assignmentsFilePath = path.join(courseFolder, 'assignments.json');
      // Define the file path to save the courses.json file (one file for all courses)
      const courseFilePath = path.join(userFolder, 'course.json');
      fs.writeFileSync(assignmentsFilePath, JSON.stringify(assignmentsForCourse, null, 2));
      fs.writeFileSync(courseFilePath, JSON.stringify(coursesOnly, null, 2));
  
      console.log(`Assignments for course ${course.courseName} saved to ${assignmentsFilePath}`);
      console.log(`Courses saved to ${courseFilePath}`);
    });
}
  
function getUserIdByEmail(email) {
    try {
      // Read the users.json file
      const users = JSON.parse(fs.readFileSync(usersFilePath, "utf8"));
  
      // Find the user by email
      const existingUser = users.find((user) => user.email === email);
  
      if (existingUser) {
        console.log("User found:", existingUser.username);
        return existingUser.id; // Return the userID of the found user
      } else {
        console.log("User not found");
        return null; // Return null if user is not found
      }
    } catch (error) {
      console.error("Error reading users file:", error);
      return null; // In case of an error, return null
    }
}

router.post("/", (req, res) => {
    const { url, title, dueDate, content, courseName, email } = req.body;
  
    const match = url.match(/(https:\/\/canvas\.kth\.se\/courses\/\d+)/);
    if (!match) {
      return res.status(400).send("Invalid assignment URL format");
    }
  
    const courseUrl = match[1];
    const assignmentEntry = {
      title,
      link: url,
      dueDate,
      content,
    };
  
    let assignmentsData = loadAssignments();
  
    const courseIndex = assignmentsData.findIndex(
      (course) => course.url === courseUrl && course.email === email
    );
  
    if (courseIndex !== -1) {
      const course = assignmentsData[courseIndex];
  
      const existingAssignmentIndex = course.assignments.findIndex((a) => a.link === url);
      if (existingAssignmentIndex !== -1) {
        course.assignments[existingAssignmentIndex] = assignmentEntry;
      } else {
        course.assignments.push(assignmentEntry);
      }
    } else {
      assignmentsData.push({
        courseName,
        url: courseUrl,
        email,
        assignments: [assignmentEntry],
      });
    }
    console.log(assignmentsData[0].email);
    const userid = getUserIdByEmail(assignmentsData[0].email);
    saveAssignments(assignmentsData, userid);
    res.send("Assignment saved successfully.");
  });

  export default router;