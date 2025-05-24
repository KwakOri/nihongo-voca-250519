"use client";

import { TQuiz } from "@/app/(providers)/(root)/level/[level]/day/[day]/quiz/[type]/page";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface QuizCardProps {
  quiz: TQuiz;
  type: number;
  nextQuiz: (isCorrect: boolean) => void;
  isLastQuiz: boolean;
}

const QuizCard = ({ quiz, nextQuiz, isLastQuiz }: QuizCardProps) => {
  const navigate = useRouter();

  const [pick, setPick] = useState<number>(-1);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isQuizEnded, setIsQuizEnded] = useState<boolean>(false);

  const resetQuizCard = () => {
    setPick(-1);
    setIsCorrect(null);
    setIsQuizEnded(false);
  };

  const clickSelect = (id: number, isCorrect: boolean) => {
    if (id === pick) {
      resetQuizCard();
    } else {
      setPick(id);
      setIsCorrect(isCorrect);
    }
  };

  const endQuiz = () => {
    if (pick === -1) return alert("정답을 선택해주세요");
    setIsQuizEnded(true);
  };

  const onClickCheckButton = () => {
    if (isCorrect === null) return alert("오류가 발생했습니다");
    resetQuizCard();
    nextQuiz(isCorrect);
  };

  return (
    <div className="flex flex-col gap-2 h-full grow">
      <div className="w-full aspect-square bg-[#2d2d2d] rounded flex flex-col justify-center items-center">
        {quiz.quiz}
      </div>
      <div className="grid grid-cols-2 gap-2 h-full grow">
        {quiz.selects.map((select) => (
          <button
            key={select.surface}
            className={`rounded flex justify-center items-center ${
              isQuizEnded && select.isCorrect
                ? "bg-[#993b34]"
                : pick === select.id
                ? "bg-[#347699]"
                : "bg-[#2d2d2d]"
            }`}
            onClick={() => clickSelect(select.id, select.isCorrect)}
            disabled={isQuizEnded}
          >
            {select.surface}
          </button>
        ))}
      </div>
      {isLastQuiz ? (
        <button
          className="h-10 shrink-0 bg-[#2d2d2d] rounded"
          onClick={() => navigate.back()}
        >
          종료
        </button>
      ) : isQuizEnded && isCorrect !== null ? (
        <button
          className="h-10 shrink-0 bg-[#993b34] rounded"
          onClick={onClickCheckButton}
        >
          다음
        </button>
      ) : (
        <button
          className="h-10 shrink-0 bg-[#2d2d2d] rounded"
          onClick={endQuiz}
        >
          확인
        </button>
      )}
    </div>
  );
};

export default QuizCard;
