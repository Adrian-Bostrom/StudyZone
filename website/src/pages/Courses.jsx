import React from "react";
import ChatBox from "./components/ChatBox";
import DeadlineCard from "./components/DeadlineCard";
import ModuleBox from "./components/ModuleBox";
import ModuleCard from "./components/ModuleCard";
import DeadlineBox from "./components/DeadlineBox";

function Courses({CourseCode, CourseName, CourseDescription}) {
    return (
      <>
      <div className="flex flex-row min-h-screen relative">
        {/* Left Column */}
        <div className="flex flex-col bg-gray-100 p-12 flex-grow">
          <ChatBox />
          {/* Course Code */}
          <h1 
            className="text-5xl font-bold mb-1">{CourseCode}
          </h1>
          {/* Course Name */}
          <h2 className="text-2xl font-bold mb-4 text-gray-600">
            {CourseName}
          </h2>
          {/* Course description */}
          <p className="text-gray-600 text-center max-w-2xl">
            {CourseDescription}
          </p>
          {/* ModuleBox Section */}
          <ModuleBox>
            {/* module examples */}
            <ModuleCard
              targetPage="/module1"
              ModuleNr="Module alpha"
              ModuleName="Introduction to Networkingidejdoij doijdo iwjdjdjoiwj doiwjwoi ihjuwhuhu hudwhudwhd iuhwudh uw uh uw"
            />
          </ModuleBox>
        </div>

        {/* Right Column */}
        <div className="right-0 top-0 h-full flex-col items-start">
          <DeadlineBox>
            <DeadlineCard
              AssignmentType="w3school training with mackan"
              DueDate="2025-04-10"
              targetPage="/signup"
            />
            <DeadlineCard
              AssignmentType="scrum 101 with DANTE SOLENDER"
              DueDate="2025-04-10"
              targetPage="/signup"
            />
            <DeadlineCard
              AssignmentType="Expressen artiklar med John"
              DueDate="2025-04-10"
              targetPage="/signup"
            />
            <DeadlineCard
              AssignmentType="backend fingering med adrian"
              DueDate="2025-04-10"
              targetPage="/signup"
            />
          </DeadlineBox>
        </div>
        </div>
    </>
  );
}

export default Courses;