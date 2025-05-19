"use client";

import { supabase } from "@/db/supabase";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Home() {
  const { data, isPending } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("words")
        .select("*")
        .eq("day", 1)
        .in("part", ["동사", "형용사"]);

      if (error) {
        console.error("Error fetching data:", error.message);
      } else {
        return data;
      }
    },
  });

  console.log("isLoading => ", isPending);
  console.log("data => ", data);

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
