import CourseCard from "./components/CourseCard";

const Overview = () => {
  return (

    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <CourseCard course="SF1654" />
        <h1 className="text-4xl font-bold mb-4">Overview</h1>
        <p className="text-gray-600 text-center">This is the overview page.</p>
    </div>
  );
}

export default Overview;