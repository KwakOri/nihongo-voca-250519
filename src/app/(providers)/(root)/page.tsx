"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <h1 className="text-white text-xl">NIHONGO VOCA</h1>

      <Link
        href="levels"
        className="bg-[#2d2d2d] w-full h-20 rounded flex justify-center items-center text-white"
      >
        공부하러 가기
      </Link>
    </div>
  );
}
