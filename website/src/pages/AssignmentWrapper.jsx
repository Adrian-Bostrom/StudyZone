import React from "react";
import { useParams } from "react-router-dom";
import assignments from "../data/assignments.json"; // Import the JSON file

const AssignmentWrapper = () => {
  const { id } = useParams(); // Extract the assignment ID from the URL
  const assignment = assignments.find(a => a.id === id); // Find the assignment by ID



  // Calculate Start Date (Due Date - 2 days)
  const dueDate = new Date(assignment.dueDate);
  const startDate = new Date(dueDate);
  startDate.setDate(dueDate.getDate() - 2); // Subtract 2 days from the Due Date

  // Format the Start Date as YYYY-MM-DD
  const formattedStartDate = startDate.toISOString().split("T")[0];

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-cyan-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">{assignment.title}</h1>
        <p className="mt-2 text-lg">{assignment.description}</p>
      </div>

      {/* Details Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700 text-lg">
          <span className="font-bold">Due Date:</span> {assignment.dueDate}
        </p>
        <p className="text-gray-700 text-lg mt-2">
          <span className="font-bold">Start Date:</span> {formattedStartDate}
        </p>
      </div>
    </div>
  );
};

export default AssignmentWrapper;