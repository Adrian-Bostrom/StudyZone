import React from "react";
import ChatBox from "./components/ChatBox";
import DeadlineCard from "./components/DeadlineCard";
import ModuleBox from "./components/ModuleBox";
import ModuleCard from "./components/ModuleCard";
import DeadlineBox from "./components/DeadlineBox";

function Course() {
    return (
      <>
        <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100 p-12">
        <ChatBox/>
          <h1 className="text-5xl font-bold mb-1">IK1203</h1>
          <h2 className="text-2xl font-bold mb-4 text-gray-600">Derivation and Integration</h2>
          <p className="text-gray-600 text-center max-w-2xl">
            {CourseDescription}
          </p>
          {/* ModuleBox Section */}
          <ModuleBox>
            {/* module examples */}
            <ModuleCard
              targetPage="/module1"
              ModuleNr="Module alpha"
              ModuleName="Introduction to Networkingidejdoij doijdo iwjdjdjoiwj doiwjwoi ihjuwhuhu hudwhudwhd iuhwudh uw uh uw"
            />
            <ModuleCard
              targetPage="/module2"
              ModuleNr="Module Beta"
              ModuleName="Introduction to Netw"
            /><ModuleCard
            targetPage="/module2"
            ModuleNr="Module Beta"
            ModuleName="Introduction to Netw"
          /><ModuleCard
          targetPage="/module2"
          ModuleNr="Module Beta"
          ModuleName="Introduction to Netw"
        /><ModuleCard
        targetPage="/module2"
        ModuleNr="Module Beta"
        ModuleName="Introduction to Netw"
      /><ModuleCard
      targetPage="/module2"
      ModuleNr="Module Beta"
      ModuleName="Introduction to Netw"
    />
          </ModuleBox>
        </div>

        {/* Right Column */}
        <div className="right-0 top-0 h-full flex-col items-start">
          <DeadlineBox>
            <DeadlineCard
              AssignmentType="homework on react med den underbara mackand wdw dw dw wd w dwd wd wdwd w wdwd wd wd w dwdwdw dwdw w w wdwdw wd wd "
              DueDate="2025-04-10"
              targetPage="/signup"
            />
            <DeadlineCard
              AssignmentType="w3school training with mackan"
              DueDate="2025-04-10"
              targetPage="/signup"
            />
            <DeadlineCard
              AssignmentType="scrum 101 with DANTE SOLENDER"
              DueDate="2025-04-10"
              targetPage="/signup"
            />
          </DeadlineBox>
        </div>
      </div>
    </>
  );
}

export default Course;