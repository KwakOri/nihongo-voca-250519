import { supabase } from "@/db/supabase";

export async function saveQuizData(meta: {
  level: number;
  day: number;
  type: number;
  total: number;
  currentIndex: number;
  quizOrder: number[];
  scoreBoard: { index: number; correct: boolean }[];
}) {
  const sessionRes = await supabase.auth.getSession();
  const userId = sessionRes.data.session?.user?.id;
  if (!userId) return;

  const { level, day, type, total, currentIndex, quizOrder, scoreBoard } = meta;

  const now = new Date().toISOString();

  // ✅ 1. word_logs (중복 없이 upsert)
  const wordLogRows = scoreBoard.map((item) => ({
    user_id: userId,
    word_id: quizOrder[item.index],
    quiz_type: type,
    is_correct: item.correct,
    attempted_at: now,
  }));

  const wordLogRes = await supabase.from("word_logs").upsert(wordLogRows, {
    onConflict: "user_id,word_id,quiz_type",
  });

  if (wordLogRes.error) {
    console.error("❌ word_logs 저장 실패:", wordLogRes.error.message);
  }

  // ✅ 2. quiz_logs (퀴즈 세트 단위 기록)
  const correctCount = scoreBoard.filter((s) => s.correct).length;

  const quizLogRes = await supabase.from("quiz_logs").insert([
    {
      user_id: userId,
      level,
      day,
      type,
      total,
      correct_count: correctCount,
      score_board: scoreBoard.map((s) => ({
        word_id: quizOrder[s.index],
        correct: s.correct,
      })),
      submitted_at: now,
    },
  ]);

  if (quizLogRes.error) {
    console.error("❌ quiz_logs 저장 실패:", quizLogRes.error.message);
  }

  // ✅ 3. quiz_progress (유저별 1개만 유지)
  const quizProgressRes = await supabase.from("quiz_progress").upsert(
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

  if (quizProgressRes.error) {
    console.error("❌ quiz_progress 저장 실패:", quizProgressRes.error.message);
  }

  console.log("✅ 모든 퀴즈 데이터 저장 완료");
}
