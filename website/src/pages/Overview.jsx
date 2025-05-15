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

  const { data: courses, error } = UseFetchJson('/courses', bodyData);
  console.log("Fetched courses:", courses);

  const handleCourseClick = (courseCode) => {
    navigate(`/courses/${courseCode}`);
  };

  // Extract courseCodes as an array from courses
  const courseCodes = courses ? courses.map(course => course.courseCode) : [];

  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      {/* Left Side - Courses */}
      <div className="flex flex-col flex-grow p-12 w-2/3">
        <h1 className="text-5xl font-bold mb-1">Overview</h1>
        <p className="text-gray-600 text-start">This is the overview page.</p>

        {error && <p>Error: {error}</p>}

        <div className="grid grid-cols-3 mt-5 gap-4 p-4">
          {courses &&
            courses.map((course) => (
              <div
                key={course.courseId}
                className="cursor-pointer"
                onClick={() => handleCourseClick(course.courseCode)}
              >
                <CourseCard course={course.courseName} />
              </div>
            ))}
        </div>
      </div>

      {/* Right Side - DeadlineBoxes */}
      <div className="w-1/3 border-l bg-white p-6 overflow-y-auto shadow-inner">
        <div className="mb-4">
          <DeadlineBox courseCodes={courseCodes} />
        </div>
      </div>
    </div>
  );
};

export default Overview;
