import { useParams } from "react-router-dom";
import UseFetchJson from "./components/UseFetchJson";

const CourseWrapper = () => {
  const { courseId } = useParams();
  const userSessionID = localStorage.getItem('userSessionID');
  
  const { data: assignments, error } = UseFetchJson(`http://localhost:5000/assignments/${courseId}`, { userSessionID });

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Course: {courseId}</h1>
      {error && <p>Error loading assignments</p>}
      {assignments && assignments.map(ass => (
        <div key={ass.id} className="p-2 bg-gray-200 my-2 rounded">
          {ass.title}
        </div>
      ))}
    </div>
  );
};

