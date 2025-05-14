import React from "react";
import DeadlineBox from "./components/DeadlineBox";
import CourseCard from "./components/CourseCard";
import UseFetchJson from "./components/UseFetchJson";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const userID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userID }), [userID]);
  const navigate = useNavigate();

  const { data: courses, error } = UseFetchJson('http://localhost:5000/courses', bodyData);
  console.log("Fetched courses:", courses);

  const handleCourseClick = (courseName) => {
    navigate(`/courses/${courseName}`);
  };

  return (
    <div className="flex flex-row min-h-screen">
    {/* Left Column */}
    <div className="flex flex-col bg-gray-100 p-12 flex-grow"> 
      <h1 className="text-5xl font-bold mb-1">
       Overview</h1>
      <p className="text-gray-600 text-start">This is the overview page.</p>

      {error && <p>Error: {error}</p>}
      <div className="grid grid-cols-3 grid-colsb mt-5 gap-4 p-4">
        {courses && courses.map((course) => (
          <div
              key={course.courseId}
              onClick={() => handleCourseClick(course.courseCode)}
              className="cursor-pointer"
            >
              <CourseCard course={course.courseName} />
            </div>
        ))}
    </div>

    </div>
    {/* Right Column */}
    <div className="right-0 top-0 w-100 flex-col items-start">
      <DeadlineBox/>
    </div>
    </div>
  );
}

export default Overview;
