"use client";

import { useAuth } from "@/providers/AuthProvider";
import { logoutUser } from "@/services/auth/logout";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [savedQuiz, setSavedQuiz] = useState<null | {
    level: number;
    day: number;
    type: number;
  }>(null);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push("/login"); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.log(error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  const { profile, isLoading, session } = useAuth();

  useEffect(() => {
    const savedQuizRaw = localStorage.getItem("quiz-meta");
    if (savedQuizRaw) {
      try {
        setSavedQuiz(JSON.parse(savedQuizRaw));
      } catch (e) {
        console.error("Invalid localStorage value:", e);
      }
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <h1 className="text-white text-xl">NIHONGO VOCA</h1>

      <Link
        href="level"
        className="bg-[#2d2d2d] w-full h-20 rounded flex justify-center items-center text-white"
      >
        공부하러 가기
      </Link>
      <div className="w-full">
        <p>진행중인 퀴즈</p>
        <div className="w-full h-20">
          {savedQuiz ? (
            <Link
              href={`/level/${savedQuiz.level}/day/${savedQuiz.day}/quiz/${savedQuiz.type}`}
              className="bg-[#2d2d2d] w-full h-20 rounded flex justify-center items-center text-white"
            >
              level:{savedQuiz.level}, day:{savedQuiz.day}, type:
              {savedQuiz.type}
            </Link>
          ) : (
            <p>진행중인 퀴즈가 없습니다.</p>
          )}
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded"
      >
        로그아웃
      </button>
    </div>
  );
}
