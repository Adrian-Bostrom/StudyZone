import CourseCard from "./components/CourseCard";
import UseFetchJson from "./components/UseFetchJson";

import { useMemo } from "react";

const Overview = () => {
  // Example userID you pass to backend
  const userSessionID = "481bf323-c001-415d-9431-26fd48803cb4";

  const bodyData = useMemo(() => ({ userSessionID }), [userSessionID]);

  const { data: courses, error } = UseFetchJson('http://localhost:5000/courses', bodyData);
  console.log("Fetched courses:", courses);


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Overview</h1>
      <p className="text-gray-600 text-center">This is the overview page.</p>

      {error && <p>Error: {error}</p>}
      {courses && courses.map((course) => (
        <CourseCard key={course.courseId} course={course.courseName} />
      ))}
    </div>
  );
}

export default Overview;
