const CourseCard = ({ course }) => {
    return (
        <box className="bg-white shadow-md rounded-lg p-1 m-4 w-40 h-30 flex-col items-center justify-center font-bold text-gray-700">
        <div className="w-1/1 h-2/3 bg-amber-500 rounded-lg"/>
        <div className="ml-4 mt-2">{course}</div>
        </box>
    )
};

CourseCard.defaultProps = {
    course: 'Invalid Course',
};

export default CourseCard;