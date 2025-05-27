"use client";

import { useParams, useRouter } from "next/navigation";

export const typeTitles = {
  1: "발음",
  2: "한자",
  3: "뜻",
  4: "문장",
};

const QuizTypePage = () => {
  const types = [1, 2, 3, 4];

  const router = useRouter();
  const { level, day } = useParams();
  const onGoBackButtonClick = () => {
    router.push(`/level/${level}/day/${day}`);
  };
  const onQuizTypeClick = (type: number) => {
    if (type !== 2 && type !== 3)
      return alert("현재 지원되지 않는 기능입니다.");
    localStorage.removeItem("quiz");
    localStorage.removeItem("quiz-meta");
    router.push(`quiz/${type}`);
  };
  return (
    <div className="h-full flex flex-col">
      <div className="sticky z-10 top-0 w-full h-12 grid grid-cols-3 gap-2 bg-black pb-2 shrink-0">
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
          <button
            onClick={() => onQuizTypeClick(type)}
            key={type}
            className={`grow w-full h-full flex justify-center items-center rounded ${
              type === 2 || type === 3 ? "bg-[#2d2d2d]" : "bg-[#111111]"
            }`}
          >
            {(typeTitles as Record<number, string>)[type]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizTypePage;
