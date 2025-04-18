import React from "react";
import { useNavigate } from "react-router-dom";

const ModuleCard = ({ ModuleNr, ModuleName, targetPage }) => {
  const navigate = useNavigate(); // Hook to programmatically navigate

  const handleClick = () => {
    if (targetPage) {
      navigate(targetPage);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="bg-cyan-600 text-white p-4 rounded-lg shadow-lg w-full h-auto flex items-start justify-start hover:bg-gray-700 transition-colors"
    >
      <div className="flex flex-col items-start text-left">
        <div>{ModuleNr} -</div>
        <div>{ModuleName}</div>
      </div>
    </button>
  );
};

export default ModuleCard;