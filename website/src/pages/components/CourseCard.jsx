import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, courseId }) => {
    const navigate = useNavigate();
    return (
      <box onClick={() => navigate(`/courses/${courseId}`)} 
          className="bg-cyan-700 text-white p-4 rounded-lg shadow-lg w-full h-auto flex items-start justify-start hover:bg-gray-700 transition-colors">
        <div>{course}</div>
        </box>
    )
};

CourseCard.defaultProps = {
    course: 'Invalid Course',
};

export default CourseCard;