"use client";

import { useParams, useRouter } from "next/navigation";

const Level = () => {
  const { level } = useParams();
  const navigate = useRouter();

  const onGoBackButtonClick = () => {
    navigate.back();
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-10 grid grid-cols-3 gap-2">
        <button
          className={
            "rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs"
          }
          onClick={onGoBackButtonClick}
        >
          뒤로가기
        </button>
        <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs">
          N{level}
        </p>
        <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs">
          미정
        </p>
      </div>

      {/* <DaysContainer /> */}
    </div>
  );
};

export default Level;
