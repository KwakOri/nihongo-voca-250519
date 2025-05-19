import { getWordsCountByAllDays, getWordsOfDay } from "@/services/words";
import { useQuery } from "@tanstack/react-query";

interface UseGetWordsByDayProps {
  day: number;
}

export const useGetWordsCountByDay = () => {
  return useQuery({
    queryKey: ["count", "words", "all"],
    queryFn: getWordsCountByAllDays,
  });
};

export const useGetWordsByDay = ({ day }: UseGetWordsByDayProps) => {
  return useQuery({
    queryKey: ["words", "day", day],
    queryFn: () => getWordsOfDay({ day }),
  });
};
