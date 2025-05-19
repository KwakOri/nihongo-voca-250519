// import RubySentence from "@/components/RubySentence/RubySentence";
// import RubyWord from "@/components/RubyWord";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";

const DayPage = () => {
  const { level, day } = useParams();
  const navigate = useRouter();

  const onGoBackButtonClick = () => {
    navigate.back();
  };
  // const wordList = words.filter((word) => word.day === Number(day));
  return (
    <div className="w-full h-full overflow-scroll">
      {/* <div className="sticky z-10 top-0 w-full h-12 grid grid-cols-3 gap-2 bg-black pb-2">
        <button
          className={
            "rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs"
          }
          onClick={onGoBackButtonClick}
        >
          뒤로가기
        </button>
        <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs">
          N{level} DAY {day}
        </p>
        <Link
          to={"quiz"}
          className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs"
        >
          QUIZ
        </Link>
      </div>

      <div className={"flex flex-col gap-4"}>
        {wordList.map((word) => {
          const done = records.find(
            (record) => record.word_id === word.id
          )?.done;
          const sentence = sentences.find(
            (sentence) => sentence.word_id === word.id
          );
          return (
            <div
              className={`rounded-xl bg-[#2d2d2d] w-full aspect-square flex flex-col justify-center gap-10 ${
                done ? "brightness-50" : "hover:brightness-125"
              }`}
              key={word.id}
            >
              <RubyWord word={word} />
              <div>
                <RubySentence tokens={sentence?.tokens} />
                <p className={"text-white"}>{sentence?.kr}</p>
              </div>
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default DayPage;
