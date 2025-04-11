import React from "react";
import ChatBox from "./components/ChatBox";
import DeadlineCard from "./components/DeadlineCard";
import ModuleBox from "./components/ModuleBox";
import ModuleCard from "./components/ModuleCard";
import DeadlineBox from "./components/DeadlineBox";

function Courses({CourseCode, CourseName, CourseDescription}) {
    return (
      <>
      <div className="flex flex-row min-h-screen">
        {/* Left Column */}
        <div className="flex flex-col bg-gray-100 p-12 flex-grow">
          <ChatBox />
          <h1 className="text-5xl font-bold mb-1">{CourseCode}</h1>
          <h2 className="text-2xl font-bold mb-4 text-gray-600">
            {CourseName}
          </h2>
          <p className="text-gray-600 text-center max-w-2xl">
            {CourseDescription}
          </p>
          <ModuleBox/>
        </div>
        {/* Deadline box */}
        <div className="absolut right-0 top-0 w-250 flex-col items-start">
          <DeadlineBox/>
        </div>
      </div>
    </>
  );
}

export default Courses;