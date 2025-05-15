import UseFetchJson from "./components/UseFetchJson";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import {React, useRef} from "react";
import { useNavigate } from "react-router-dom";
import ChatBox from "./components/ChatBox";

const CourseWrapper = () => {
  const navigate = useNavigate();
  const { courseCode } = useParams();
  const userID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userID }), [userID]);
  // Fetch the assignments for the course using the courseCode and session ID
  const { data: assignments, error } = UseFetchJson(`/assignment/${courseCode}`, bodyData);
  console.log('Assignments:', assignments);

  const chatRef = useRef();

  return (
    <div className="p-8">
      <ChatBox ref={chatRef}/>
      <h1 className="text-3xl font-bold mb-4">Course: {courseCode}</h1>
      
      {error && <p>Error loading assignments</p>}
      {assignments && assignments.map(ass => (
        <div
          key={ass.id}
          className="p-2 bg-gray-200 my-2 rounded cursor-pointer hover:scale-102 transition-transform"
          onClick={() => navigate(`/courses/${courseCode}/${ass.id}`)} // Navigate to the assignment details page
        >
          {ass.title}
        </div>
      ))}

      <button onClick={() => (chatRef.current?.sendMessage("Generate a studyplan about this course"), chatRef.current?.openChat())} className="bg-blue-500 p-3 rounded-xl text-white font-bold mt-2 hover:cursor-pointer hover:scale-105 transition-transform" >Generate a studyplan</button>
      <button onClick={() => (chatRef.current?.sendMessage("Generate a quiz about this course"), chatRef.current?.openChat())} className="bg-blue-500 p-3 rounded-xl text-white font-bold ml-3 mt-2 hover:cursor-pointer hover:scale-105 transition-transform">Generate a quiz</button>
    </div>
  );
};

export default CourseWrapper;