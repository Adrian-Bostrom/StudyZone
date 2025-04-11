import React from "react";
import deadlines from "../../data/deadlines.json";
import DeadlineCard from "./DeadlineCard";

const DeadlineBox = () => {
  return (
    <div className="Reletive h-dvh top-0 right-0 w-100 gap-4 p-4 bg-gray-300 shadow-lg">
      <h2 className="pt-12 pl-6 font-bold text-[30px]">Deadlines</h2>
      <div className="flex flex-col gap-4">
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