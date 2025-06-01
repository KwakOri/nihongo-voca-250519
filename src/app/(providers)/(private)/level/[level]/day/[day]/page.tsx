"use client";

import { useMemorySyncBeforeNavigation } from "@/app/(providers)/(private)/level/[level]/day/[day]/_hooks/useMemorySyncBeforeNavigation";
import JPParagraph from "@/components/JPParagraph";
import Loading from "@/components/Loading";
import { useAuth } from "@/providers/AuthProvider";
import { queryClient } from "@/providers/QueryProvider/QueryProvider";
import { useGetWordsByDay } from "@/queries/words";
import { syncMemoryLogs } from "@/services/words";
import { DBWordWithQuiz } from "@/types/words";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";

const DayPage = () => {
  const { userId } = useAuth();
  const { level, day } = useParams();

  const [isMeaningVisible, setIsMeaningVisible] = useState(true);
  const [isPronunciationVisible, setIsPronunciationVisible] = useState(true);
  const [isDoneVisible, setIsDoneVisible] = useState(true);

  const { data, isPending } = useGetWordsByDay({
    day: Number(day),
    level: Number(level),
  });

  const {
    originMemoryLogs,
    newMemoryLogs,
    setOriginMemoryLogs,
    setNewMemoryLogs,
    toggleNewMemoryLog,
    syncAndPush,
    syncAndBack,
  } = useMemorySyncBeforeNavigation({
    userId: userId as string,
    level: level as string,
    day: day as string,
  });

  console.log(
    "originMemoryLogs => ",
    originMemoryLogs,
    "newMemoryLogs => ",
    newMemoryLogs
  );

  const checkIsIncludedInMemory = (wordId: number) => {
    return newMemoryLogs.includes(wordId);
  };

  const onGoBackButtonClick = () => {
    syncAndPush(`/level/${level}`);
  };

  useEffect(() => {
    if (isPending || !data) return;

    const memoryLogs = data
      .map((word: DBWordWithQuiz) => word.word_memory_logs[0]?.word_id)
      .filter((item): item is number => typeof item === "number");

    setOriginMemoryLogs(memoryLogs);
    setNewMemoryLogs(memoryLogs);
  }, [isPending, data]); // ← 반드시 data 포함

  useEffect(() => {
    const handlePopState = () => {
      // popstate 이벤트는 async를 직접 쓸 수 없으므로, 래핑
      syncMemoryLogs(userId as string, originMemoryLogs, newMemoryLogs)
        .then(() => {
          queryClient.invalidateQueries({
            queryKey: ["words", undefined, "level", level, "day", day],
          });
        })
        .catch((e) => {
          console.error("뒤로가기 sync 실패:", e);
        });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [userId, originMemoryLogs, newMemoryLogs]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      console.log("📦 beforeunload 시 보내는 데이터:", {
        userId,
        originMemoryLogs,
        newMemoryLogs,
      });

      const payload = {
        userId,
        originMemoryLogs,
        newMemoryLogs,
      };

      navigator.sendBeacon(
        "/api/sync-memory-logs",
        new Blob([JSON.stringify(payload)], { type: "application/json" })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [userId, originMemoryLogs, newMemoryLogs]); // ← 의존성에도 명확히 포함

  if (!data || isPending) return <Loading />;

  return (
    <div className="w-full h-full overflow-scroll">
      <div className="sticky z-10 top-0 w-full h-12 grid grid-cols-3 gap-2 bg-black pb-2 z-20">
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
          href={`${day}/quiz`}
          className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs hover:brightness-125"
        >
          QUIZ
        </Link>
      </div>

      <div className={"flex flex-col gap-2"}>
        {data
          .filter((word) => {
            if (isDoneVisible) {
              return true;
            } else {
              return !checkIsIncludedInMemory(word.id);
            }
          })
          .map((word: DBWordWithQuiz) => {
            const allTypes = [1, 2, 3, 4];
            const clearNumbers = word.word_logs
              .filter((log) => log.is_correct === true)
              .map((log) => log.quiz_type);
            if (clearNumbers.length > 0) console.log(clearNumbers);

            const typeNumbers = word.quiz.map((item) => Number(item.type));
            return (
              <div
                className={`rounded-xl w-full h-full aspect-square relative`}
                key={word.id}
              >
                <button
                  onClick={() => toggleNewMemoryLog(word.id)}
                  className="absolute left-2 top-2 p-2 z-10"
                >
                  <div
                    className={`rounded-lg w-6 aspect-square flex justify-center items-center ${
                      checkIsIncludedInMemory(word.id)
                        ? "bg-[#e9e9e9]"
                        : "bg-[#a5a5a5]"
                    }`}
                  >
                    <FaCheck color={"#2d2d2d"} />
                  </div>
                </button>
                <div
                  className={`w-full h-full flex flex-col justify-center items-center gap-10 bg-[#2d2d2d] rounded-lg ${
                    checkIsIncludedInMemory(word.id)
                      ? "brightness-50"
                      : "brightness-100"
                  }`}
                >
                  <div className={`absolute top-4 right-4 flex gap-1`}>
                    {allTypes.map((type) => {
                      return (
                        <div
                          className={`flex flex-col items-center`}
                          key={`${word.id}-${type}`}
                        >
                          <p>
                            {type === 1
                              ? "あ"
                              : type === 2
                              ? "漢"
                              : type === 3
                              ? "한"
                              : "절"}
                          </p>
                          <div
                            className={`rounded-full h-4 w-4 ${
                              clearNumbers.includes(type)
                                ? "bg-[#58b1ff]"
                                : typeNumbers.includes(type)
                                ? "bg-white"
                                : "bg-[#444444]"
                            }`}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                  <JPParagraph
                    isDone={checkIsIncludedInMemory(word.id)}
                    tokens={word.tokens}
                    meaning={word.meaning}
                    isMeaningVisible={isMeaningVisible}
                    isPronunciationVisible={isPronunciationVisible}
                  />
                </div>
                {/* <div>
                <RubySentence tokens={sentence?.tokens} />
                <p className={"text-white"}>{sentence?.kr}</p>
              </div> */}
              </div>
            );
          })}
      </div>
      <div className="absolute px-4 py-2 bottom-0 left-0 w-full h-12 grid grid-cols-3 gap-2 bg-black pb-2">
        <button
          className={`bg-[#2d2d2d] rounded ${
            isMeaningVisible ? "opacity-100" : "opacity-50"
          }`}
          onClick={() => {
            setIsMeaningVisible((prev) => !prev);
          }}
        >
          {isMeaningVisible ? "뜻 끄기" : "뜻 켜기"}
        </button>
        <button
          className={`bg-[#2d2d2d] ${
            isPronunciationVisible ? "opacity-100" : "opacity-50"
          }`}
          onClick={() => {
            setIsPronunciationVisible((prev) => !prev);
          }}
        >
          {isPronunciationVisible ? "후리 끄기" : "후리 켜기"}
        </button>
        <button
          className={`bg-[#2d2d2d] ${
            isDoneVisible ? "opacity-100" : "opacity-50"
          }`}
          onClick={() => {
            setIsDoneVisible((prev) => !prev);
          }}
        >
          {isDoneVisible ? "완료 숨기기" : "완료 보기"}
        </button>
      </div>
    </div>
  );
};

export default DayPage;
