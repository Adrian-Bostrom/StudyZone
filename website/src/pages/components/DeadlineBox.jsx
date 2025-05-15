import React, { useMemo } from "react";
import UseFetchJson from "./UseFetchJson";
import DeadlineCard from "./DeadlineCard";
import parseDateToISO from "./parseDate"; // adjust import path if needed

const DeadlineBox = ({ courseCodes }) => {
  const userID = localStorage.getItem('userID');

  const results = (courseCodes || []).map(courseCode => {
    const bodyData = useMemo(() => ({ userID, courseCode }), [userID, courseCode]);
    const { data: assignments, error } = UseFetchJson(`/assignment/${courseCode}`, bodyData);
    return { assignments, error, courseCode };
  });

  const now = new Date();

  return (
    <div className="h-full top-0 right-0 w-100 p-4 bg-gray-150 shadow-lg">
      <h2 className="pt-12 pl-6 pb-3.5 font-bold text-[30px]">Deadlines</h2>
      <div className="flex flex-col gap-0">
        {results.map(({ assignments, error, courseCode }) =>
          assignments &&
            assignments
    .map((ass) => ({
      ...ass,
      dueDateISO: parseDateToISO(ass.dueDate)
    }))
    .filter((ass) => ass.dueDateISO && new Date(ass.dueDateISO) > now)
    .sort((a, b) => new Date(a.dueDateISO) - new Date(b.dueDateISO))
    .map((ass) => (
      <DeadlineCard
        key={ass.id}
        title={ass.title}
        date={ass.dueDate}
        id={ass.id}
        courseId={courseCode}
      />
    ))

        )}
      </div>
    </div>
  );
};

export default DeadlineBox;
