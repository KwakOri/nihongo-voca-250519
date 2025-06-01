import { supabase } from "@/db/supabase";

interface GetWordsOfDayProps {
  day: number;
  level: number;
}

interface GetWordsWithQuizByDayProps {
  day: number;
  level: number;
}

export const getWordsCountByAllDays = async (level: number) => {
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user?.id;
  if (!userId) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("words")
    .select("id, day, word_memory_logs(*)")
    .order("day", { ascending: true })
    .eq("level", level);

  if (error) {
    throw new Error(error.message);
  }

  // ✅ 집계 객체: { [day]: { count, total } }
  const countByDay: Record<number, { count: number; total: number }> = {};

  for (const word of data) {
    const day = word.day;
    countByDay[day] = countByDay[day] || { count: 0, total: 0 };

    countByDay[day].total += 1;

    const hasCorrect = word.word_memory_logs?.some(
      (log) => log.user_id === userId && log.is_checked
    );

    if (hasCorrect) {
      countByDay[day].count += 1;
    }
  }

  // ✅ 객체 → 정렬된 배열
  return Object.entries(countByDay)
    .map(([day, { count, total }]) => ({
      day: Number(day),
      count,
      total,
    }))
    .sort((a, b) => a.day - b.day);
};

export const getWordsOfDay = async ({ day, level }: GetWordsOfDayProps) => {
  const sessionRes = await supabase.auth.getSession();
  const userId = sessionRes.data.session?.user?.id;
  if (!userId) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("words")
    .select("*, quiz(type), word_logs(*), word_memory_logs(*)")
    .eq("day", day)
    .eq("level", level)
    .eq("word_logs.user_id", userId) // 유저 본인 기록만
    .eq("word_memory_logs.user_id", userId); // 유저 본인 기록만

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getWords = async () => {
  const { data, error } = await supabase
    .from("words")
    .select("id, word, meaning")
    .range(0, 10);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getWordsWithQuizByDay = async ({
  day,
  level,
}: GetWordsWithQuizByDayProps) => {
  const { data, error } = await supabase
    .from("words")
    .select(
      `
      *,
      quiz(*)
    `
    )
    .eq("day", day)
    .eq("level", level);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const syncMemoryLogs = async (
  userId: string,
  originMemoryLogs: number[],
  newMemoryLogs: number[]
) => {
  const deletedIds = originMemoryLogs.filter(
    (id) => !newMemoryLogs.includes(id)
  );
  const addedIds = newMemoryLogs.filter((id) => !originMemoryLogs.includes(id));

  // 삭제 요청
  if (deletedIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("word_memory_logs")
      .delete()
      .in("word_id", deletedIds)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("삭제 실패:", deleteError);
    }
  }

  // 추가 요청
  if (addedIds.length > 0) {
    const inserts = addedIds.map((word_id) => ({
      user_id: userId,
      word_id,
      is_checked: true,
    }));

    const { error: insertError } = await supabase
      .from("word_memory_logs")
      .insert(inserts);

    if (insertError) {
      console.error("추가 실패:", insertError);
    }
  }
};
