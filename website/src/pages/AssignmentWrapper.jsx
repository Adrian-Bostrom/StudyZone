import UseFetchJson from "./components/UseFetchJson";
import React from "react";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const AssignmentWrapper = () => {
  const navigate = useNavigate();
  const { courseCode, assignmentId } = useParams(); 
  const userID = localStorage.getItem('userID');
  console.log(userID);

  const bodyData = useMemo(() => ({ userID }), [userID]);
  console.log("courseCode: ", courseCode);

  const { data: assignments, error, loading } = UseFetchJson(`http://localhost:5000/assignment/${courseCode}`, bodyData);
  console.log("Assignments:", assignments);

  const assignment = assignments?.find(a => a.id === assignmentId); 

  // Loading state
  if (loading) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Loading assignment...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-red-500">Error loading assignment: {error.message || error}</p>
      </div>
    );
  }

  // Assignment not found
  if (!assignment) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-700">Assignment not found.</p>
      </div>
    );
  }

  const dueDate = assignment.dueDate;

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-cyan-600 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold">{assignment.title}</h1>
        <p className="mt-2 text-lg">{assignment.content}</p>
      </div>

      {/* Details Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
        <p className="text-gray-700 text-lg">
          <span className="font-bold">Due Date:</span> {dueDate}
        </p>
        <p 
        className="text-blue-600 text-lg cursor-pointer hover:underline hover:text-blue-800"
        onClick={() => window.open(assignment.link, '_blank')}
        >
        <span className="font-bold">Link:</span> {assignment.link}
        </p>
      </div>
    </div>
  );
};

export default AssignmentWrapper;
