import React from "react";
import { useNavigate } from "react-router-dom";

const DeadlineBox = ({ AssignmentType, DueDate, targetPage }) => {
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
      className="h-10 bg-[#696969] text-white p-4 rounded-lg shadow-lg m-2 w-100 flex items-center hover:bg-gray-700 transition-colors"
    >
      <div className="flex justify-between items-center w-full">
        <div>{truncateText(AssignmentType, 30)}</div>
        <div className="text-right">{DueDate}</div>  
              </div>
    </button>
  );
};

export default DeadlineBox;