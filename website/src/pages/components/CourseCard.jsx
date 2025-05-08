import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, courseId }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/courses/${courseId}`)} 
      className="bg-white shadow-md rounded-lg p-4 m-4 w-40 cursor-pointer hover:shadow-lg transition-shadow duration-300"
    >
      <div className="w-full h-24 bg-blue-500 rounded-lg"></div>
      <div className="mt-2 text-center font-bold text-gray-700">{course}</div>
    </div>
  );
};

CourseCard.defaultProps = {
  course: 'Invalid Course',
};

export default CourseCard;
