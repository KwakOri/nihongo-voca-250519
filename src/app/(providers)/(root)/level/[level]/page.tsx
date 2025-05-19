"use client";

import LevelNavBar from "@/app/(providers)/(root)/level/[level]/_components/LevelNavBar";
import DaysContainer from "@/components/DaysContainer";

const Level = () => {
  return (
    <div className="flex flex-col gap-2 w-full h-full  overflow-scroll">
      <LevelNavBar />
      <DaysContainer />
    </div>
  );
};

export default Level;
