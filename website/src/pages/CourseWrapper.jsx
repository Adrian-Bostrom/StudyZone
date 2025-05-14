import UseFetchJson from "./components/UseFetchJson";
import { useParams } from "react-router-dom";
import { useMemo } from "react";
import React from "react";
import DeadlineBox from "./components/DeadlineBox";

const CourseWrapper = () => {
  const { courseCode } = useParams();
  const userID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userID }), [userID]);

  // Fetch the content parts for the course
  const { data: contentParts, error } = UseFetchJson(`/content/${courseCode}`, bodyData);
  // For DeadlineBox, pass courseCodes as an array with the current courseCode
  const courseCodes = [courseCode];

  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      {/* Left Side - Content Parts */}
      <div className="flex flex-col flex-grow p-12 w-2/3">
        <h1 className="text-5xl font-bold mb-1">Course: {courseCode}</h1>
        <p className="text-gray-600 text-start mb-4">Course content:</p>
        {error && <p className="text-red-500">Error loading content</p>}
        <div className="grid grid-cols-1 mt-5 gap-4 p-4">
          {contentParts && contentParts.map((part, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-200 my-2 rounded shadow"
            >
              {/* Render part content, adjust as needed */}
              <pre className="whitespace-pre-wrap">{JSON.stringify(part, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - DeadlineBox */}
      <div className="w-1/3 border-l bg-white p-6 overflow-y-auto shadow-inner">
        <div className="mb-4">
          <DeadlineBox courseCodes={courseCodes} />
        </div>
      </div>
    </div>
  );
};

export default CourseWrapper;

