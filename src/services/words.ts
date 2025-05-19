import { supabase } from "@/db/supabase";

interface GetWordsOfDayProps {
  day: number;
}

export const getWordsCountByAllDays = async () => {
  const { data, error } = await supabase.from("words").select("day");
  if (error) {
    throw new Error(error.message);
  }

  // 개수를 집계
  const countByDay = data.reduce((acc: Record<number, number>, { day }) => {
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  // 객체 형태를 배열 형태로 변환 및 정렬
  return Object.entries(countByDay)
    .map(([day, count]) => ({ day: Number(day), count }))
    .sort((a, b) => a.day - b.day);
};

export const getWordsOfDay = async ({ day }: GetWordsOfDayProps) => {
  const { data, error } = await supabase
    .from("words")
    .select("*")
    .eq("day", day);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
