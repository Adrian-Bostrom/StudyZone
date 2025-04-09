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
      className="grid bg-cyan-600 text-white p-4 rounded-lg shadow-lg m-2 w- items-start hover:bg-gray-700 transition-colors"
    >
      <div className="grid">
        <div className="text-left">{ModuleNr} - </div>  
        <div className="text-left">{ModuleName}</div>  

      </div>
    </button>
  );
};

export default ModuleCard;