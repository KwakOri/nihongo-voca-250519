import {
  getWordsCountByAllDays,
  getWordsOfDay,
  getWordsWithQuizByDay,
} from "@/services/words";
import { useQuery } from "@tanstack/react-query";

interface UseGetWordsByDayProps {
  day: number;
  level: number;
}

interface UseGetWordsWithQuizByDayProps {
  day: number;
  level: number;
}

export const useGetWordsCountByDay = (level: number) => {
  return useQuery({
    queryKey: ["count", "words", "all", "level", level],
    queryFn: () => getWordsCountByAllDays(level),
  });
};

export const useGetWordsByDay = ({ day, level }: UseGetWordsByDayProps) => {
  return useQuery({
    queryKey: ["words", , "level", level, "day", day],
    queryFn: () => getWordsOfDay({ day, level }),
  });
};

export const useGetWordsWithQuizByDay = ({
  day,
  level,
}: UseGetWordsWithQuizByDayProps) => {
  return useQuery({
    queryKey: ["quiz", "level", level, "day", day],
    queryFn: () => getWordsWithQuizByDay({ day, level }),
  });
};
