"use client";

import { supabase } from "@/db/supabase";
import { queryClient } from "@/providers/QueryProvider/QueryProvider";
import { QUIZ_PROGRESS_KEY } from "@/queries/quiz";

interface SaveQuizDataInput {
  level: number;
  day: number;
  type: number;
  total: number;
  currentIndex: number;
  quizOrder: number[];
  scoreBoard: {
    wordId: number;
    order: number;
    isCorrect: boolean;
  }[];
}

export async function saveQuizData(meta: SaveQuizDataInput) {
  const sessionRes = await supabase.auth.getSession();
  const userId = sessionRes.data.session?.user?.id;
  if (!userId) return;

  const { level, day, type, total, currentIndex, quizOrder, scoreBoard } = meta;

  const now = new Date().toISOString();

  // 🔹 1. 중도 저장 (미완료)
  if (currentIndex < total) {
    const { error } = await supabase.from("quiz_progress").upsert(
      [
        {
          user_id: userId,
          level,
          day,
          type,
          current_index: currentIndex,
          total,
          quiz_order: quizOrder,
          score_board: scoreBoard,
          saved_at: now,
        },
      ],
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("❌ quiz_progress 저장 실패:", error.message);
    } else {
      console.log("✅ quiz_progress 저장 완료");
      queryClient.invalidateQueries({ queryKey: QUIZ_PROGRESS_KEY });
    }

    return;
  }

  // ✅ 2. 퀴즈 완료 시: word_logs + quiz_logs 저장
  const wordLogs = scoreBoard.map((s) => ({
    user_id: userId,
    word_id: s.wordId,
    quiz_type: type,
    is_correct: s.isCorrect,
    attempted_at: now,
  }));

  const wordRes = await supabase.from("word_logs").upsert(wordLogs, {
    onConflict: "user_id,word_id,quiz_type",
  });

  if (wordRes.error) {
    console.error("❌ word_logs 저장 실패:", wordRes.error.message);
  }

  const correctCount = scoreBoard.filter((s) => s.isCorrect).length;

  const quizRes = await supabase.from("quiz_logs").insert([
    {
      user_id: userId,
      level,
      day,
      type,
      total,
      correct_count: correctCount,
      score_board: scoreBoard.map((s) => ({
        word_id: s.wordId,
        correct: s.isCorrect,
      })),
      submitted_at: now,
    },
  ]);

  if (quizRes.error) {
    console.error("❌ quiz_logs 저장 실패:", quizRes.error.message);
  }

  // 🧹 완료했으므로 quiz_progress 삭제
  await supabase.from("quiz_progress").delete().eq("user_id", userId);
  queryClient.invalidateQueries({ queryKey: QUIZ_PROGRESS_KEY });

  console.log("✅ 퀴즈 완료 → 결과 저장 + 진행 기록 삭제 완료");
}
