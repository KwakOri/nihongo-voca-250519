import { supabase } from "@/db/supabase";
import { getWordsWithQuizByDay } from "@/services/words";
import { DBQuiz, DBWordWithQuiz } from "@/types/words";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export const QUIZ_PROGRESS_KEY = ["quiz-progress"];

interface TUseQuizzesByType {
  day: number;
  type: string;
}

export const useQuizProgress = () => {
  const query = useQuery({
    queryKey: QUIZ_PROGRESS_KEY,
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;
      if (!userId) return null;

      const { data, error } = await supabase
        .from("quiz_progress")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error || !data) return null;

      return {
        level: data.level,
        day: data.day,
        type: data.type,
        currentIndex: data.current_index,
        total: data.total,
        quizOrder: data.quiz_order,
        scoreBoard: data.score_board,
      };
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  // ✅ quiz-meta를 localStorage에 저장
  useEffect(() => {
    if (query.data) {
      localStorage.setItem("quiz-meta", JSON.stringify(query.data));
      console.log("✅ quiz-meta restored from DB");
    }
  }, [query.data]);

  return query;
};

export const useQuizzesByType = ({ day, type }: TUseQuizzesByType) => {
  return useQuery({
    queryKey: ["quiz", "day", day, "type", type],
    queryFn: () => getWordsWithQuizByDay({ day }),
    select: (data) => {
      return data
        .map((d: DBWordWithQuiz) => ({
          ...d,
          quiz: d.quiz.filter((q: DBQuiz) => q.type === type),
        }))
        .filter((d: DBWordWithQuiz) => d.quiz.length > 0);
    },
  });
};
