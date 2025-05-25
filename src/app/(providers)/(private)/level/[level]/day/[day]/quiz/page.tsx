"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const QuizTypePage = () => {
  const types = [1, 2, 3, 4];
  const titles = {
    1: "발음",
    2: "한자",
    3: "뜻",
    4: "문장",
  };
  const navigate = useRouter();
  const onGoBackButtonClick = () => {
    navigate.back();
  };
  const onQuizTypeClick = () => {
    localStorage.removeItem("quiz");
    localStorage.removeItem("quiz-meta");
  };
  return (
    <div className="h-full flex flex-col">
      <div className="sticky z-10 top-0 w-full h-12 grid grid-cols-3 gap-2 bg-black pb-2">
        <button
          className={
            "rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs hover:brightness-125"
          }
          onClick={onGoBackButtonClick}
        >
          뒤로가기
        </button>
        <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs">
          퀴즈 유형
        </p>
        <div className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs hover:brightness-125">
          -
        </div>
      </div>
      <div className="flex flex-col h-full gap-2">
        {types.map((type) => (
          <Link
            className="grow"
            key={type}
            onClick={onQuizTypeClick}
            href={`quiz/${type}`}
          >
            <p className="w-full h-full flex justify-center items-center rounded bg-[#2d2d2d]">
              {(titles as Record<number, string>)[type]}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuizTypePage;
