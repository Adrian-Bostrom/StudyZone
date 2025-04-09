import React from "react";
import { useNavigate } from "react-router-dom";

const DeadlineCard = ({ AssignmentType, DueDate, targetPage }) => {
  const navigate = useNavigate(); // Hook to programmatically navigate

const handleClick = () => {
    if (targetPage) {
      navigate(targetPage);
    }
  };

const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

return (
    <button
      onClick={handleClick}
      className="h-auto w-full bg-cyan-600 text-white p-4 w-fill justify-between rounded-lg shadow-lg m-2 flex items-center hover:bg-gray-700 transition-colors"
    >
      <div className="flex flex-row w-full justify-between">
        <div className="text-left flex flex-col flex-grow">{AssignmentType}</div>
        <div className="ml-2 text-right whitespace-nowrap">{DueDate}</div>  
              </div>
    </button>
  );
};

export default DeadlineCard;