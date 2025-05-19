"use client";

import JPParagraph from "@/components/JPParagraph";
// import RubySentence from "@/components/RubySentence/RubySentence";
import { useGetWordsByDay } from "@/queries/words";
import { Word } from "@/types/words";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const DayPage = () => {
  const { level, day } = useParams();
  const navigate = useRouter();

  const { data, isPending } = useGetWordsByDay({ day: Number(day) });

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
          href={"quiz"}
          className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs hover:brightness-125"
        >
          QUIZ
        </Link>
      </div>

      <div className={"flex flex-col gap-4"}>
        {data.map((word: Word) => {
          return (
            <div
              className={`rounded-xl bg-[#2d2d2d] w-full aspect-square flex flex-col justify-center items-center gap-10`}
              key={word.id}
            >
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
