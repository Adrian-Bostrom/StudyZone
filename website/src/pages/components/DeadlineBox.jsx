import React from "react";
import CourseCard from "./CourseCard";
import UseFetchJson from "./UseFetchJson";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DeadlineCard from "./DeadlineCard";

const DeadlineBox = ({courseCode}) => {
  const userID = localStorage.getItem('userID');
  const bodyData = useMemo(() => ({ userID }), [userID]);
  const navigate = useNavigate();

  const { data: assignments, error } = UseFetchJson('http://localhost:5000/assignment', bodyData);
  console.log("Fetched courses:", assignments);

  return (
    <div className="h-full top-0 right-0 w-100 p-4 bg-gray-150 shadow-lg">
      <h2 className="pt-12 pl-6 pb-3.5 font-bold text-[30px]">Deadlines</h2>
      <div className="flex flex-col gap-0">
        {assignments && assignments.map((ass) => (
          <DeadlineCard
            key={ass.id}
            title={ass.title}
            date={ass.dueDate}
            id={ass.id}
            courseId={courseCode}
          />
        ))}
      </div>
    </div>
  );
};

export default DeadlineBox;