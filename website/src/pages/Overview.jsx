import React from "react";
import DeadlineBox from "./components/DeadlineBox";

const Overview = () => {
  return (

    <div className="border-1 border-e-red-500 flex flex-row min-h-screen">
        {/* Course Column */}
        <div className="border-1 flex flex-col bg-gray-100 p-12 flex-grow">
          
          <h1 className="border-1 text-5xl font-bold mb-1">
            Overview</h1>
          <p className="border-1 text-gray-600 text-start max-w-2xl">
            Here is an overview of all your courses and their assignments
            </p>
          
        </div>
        {/* Deadline box */}
        <div className="border-1 right-0 top-0 w-100 flex-col items-start">
          <DeadlineBox/>
        </div>
      </div>
  );
}

export default Overview;