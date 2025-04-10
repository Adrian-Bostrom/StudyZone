import React from 'react';

const DeadlineBox = ({ children }) => {
    return (
        <div className="relative h-lvh top-0 right-0 w-100 gap-4 p-4 bg-gray-300 shadow-lg">
            {/* This is where the DeadlineCard components will be rendered */}
            <h2 className="pt-12 pl-6 font-bold text-[30px]">Deadline</h2>
            {children}
        </div>
    );
};

export default DeadlineBox;