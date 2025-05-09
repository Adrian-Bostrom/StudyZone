import React from "react";
import deadlines from "../../data/deadlines.json";
import DeadlineCard from "./DeadlineCard";

const DeadlineBox = () => {
  return (
    <div className="h-full top-0 right-0 w-100 p-4 bg-gray-150 shadow-lg">
      <h2 className="pt-12 pl-6 pb-3.5 font-bold text-[30px]">Deadlines</h2>
      <div className="flex flex-col gap-0">
        {deadlines.map((deadline, index) => (
          <DeadlineCard
            key={index}
            AssignmentType={deadline.AssignmentType}
            DueDate={deadline.DueDate}
            targetPage={deadline.targetPage}
          />
        ))}
      </div>
    </div>
  );
};

export default DeadlineBox;