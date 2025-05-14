import React from "react";
import { useNavigate } from "react-router-dom";
import DeadlineBox from "./DeadlineBox";

const DeadlineCard = ({ title, date, id, courseId }) => {
  const navigate = useNavigate();
  

return (
    <button
      onClick={() => navigate(`/courses/${courseId}/${id}`)}
      className="h-auto bg-cyan-600 text-white p-4 w-fill justify-between rounded-lg shadow-lg m-2 flex items-center hover:bg-gray-700 transition-colors"
    >
      
      <div className="flex flex-row w-full justify-between">
        <div className="text-left flex flex-col flex-grow">{title}</div>
        <div className="ml-2 text-right whitespace-nowrap">{date}</div>  
      </div>
    </button>
  );
};

export default DeadlineCard;