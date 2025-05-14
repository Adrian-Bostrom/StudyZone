import UseFetchJson from "./components/UseFetchJson";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseWrapper = () => {
  const navigate = useNavigate();
  const { courseCode } = useParams();
  const userID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userID }), [userID]);
  // Fetch the assignments for the course using the courseCode and session ID
  const { data: assignments, error } = UseFetchJson(`/assignment/${courseCode}`, bodyData);
  console.log('Assignments:', assignments);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Course: {courseCode}</h1>
      
      {error && <p>Error loading assignments</p>}
      {assignments && assignments.map(ass => (
        <div
          key={ass.id}
          className="p-2 bg-gray-200 my-2 rounded cursor-pointer"
          onClick={() => navigate(`/courses/${courseCode}/${ass.id}`)} // Navigate to the assignment details page
        >
          {ass.title}
        </div>
      ))}
    </div>
  );
};

export default CourseWrapper;
