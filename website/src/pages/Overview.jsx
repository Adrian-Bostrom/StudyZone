import CourseCard from "./components/CourseCard";
import UseFetchJson from "./components/UseFetchJson";
import { useMemo } from "react";

const Overview = () => {
  const userSessionID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userSessionID }), [userSessionID]);

  const { data: courses, error } = UseFetchJson('http://localhost:5000/courses', bodyData);
  console.log("Fetched courses:", courses);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-4">Overview</h1>
      <p className="text-gray-600 text-center mb-8">This is the overview page.</p>

      {error && <p>Error: {error}</p>}

      <div className="flex flex-wrap gap-4 justify-center">
        {courses && courses.map((course) => (
          <CourseCard 
            key={course.courseId} 
            course={course.courseName} 
            courseId={course.courseCode} 
          />
        ))}
      </div>
    </div>
  );
}

export default Overview;
