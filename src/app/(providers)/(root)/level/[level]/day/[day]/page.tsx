"use client";

import JPParagraph from "@/components/JPParagraph";
// import RubySentence from "@/components/RubySentence/RubySentence";
import { useGetWordsByDay } from "@/queries/words";
import { DBWordWithQuiz } from "@/types/words";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const DayPage = () => {
  const { level, day } = useParams();
  const navigate = useRouter();

  const { data, isPending } = useGetWordsByDay({ day: Number(day) });

  console.log(data);

  const onGoBackButtonClick = () => {
    navigate.back();
  };

  if (!data || isPending)
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );

  return (
    <div className="w-full h-full overflow-scroll">
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
          N{level} DAY {day}
        </p>
        <Link
          href={`${day}/quiz/3`}
          className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs hover:brightness-125"
        >
          QUIZ
        </Link>
      </div>

      <div className={"flex flex-col gap-4"}>
        {data.map((word: DBWordWithQuiz) => {
          const allTypes = [1, 2, 3];
          const typeNumbers = word.quiz.map((item) => Number(item.type));
          return (
            <div
              className={`rounded-xl bg-[#2d2d2d] w-full aspect-square flex flex-col justify-center items-center gap-10 relative`}
              key={word.id}
            >
              <div className={`absolute top-4 right-4 flex gap-1`}>
                {allTypes.map((type) => {
                  return (
                    <div
                      className={`flex flex-col items-center`}
                      key={`${word.id}-${type}`}
                    >
                      <p>{type === 1 ? "あ" : type === 2 ? "漢" : "한"}</p>
                      <div
                        className={`rounded-full h-4 w-4 ${
                          typeNumbers.includes(type)
                            ? "bg-white"
                            : "bg-[#444444]"
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>
              <JPParagraph tokens={word.tokens} meaning={word.meaning} />
              {/* <div>
                <RubySentence tokens={sentence?.tokens} />
                <p className={"text-white"}>{sentence?.kr}</p>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayPage;
