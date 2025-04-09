import React from 'react';

const ModuleBox = ({ children }) => {
    return (
        <div className="grid grid-cols-3 mt-5 gap-4 p-4 bg-gray-300 rounded-lg shadow-lg">
            {children}
        </div>
    );
};

export default ModuleBox;