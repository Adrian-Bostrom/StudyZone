import React from 'react';
import ModuleCard from './ModuleCard';
import modules from '../../data/modules.json';

const ModuleBox = () => {
    return (
        <div className="grid flex-grow grid-colsb mt-5 gap-4 p-4 bg-gray-300 rounded-lg shadow-lg">
             {modules.map((moduel, index) => (
          <ModuleCard
            key={index}
            ModuleNr={moduel.ModuleNr}
            ModuleName={moduel.ModuleName}
            targetPage={moduel.targetPage}
          />
        ))}
        </div>
    );
};

export default ModuleBox;