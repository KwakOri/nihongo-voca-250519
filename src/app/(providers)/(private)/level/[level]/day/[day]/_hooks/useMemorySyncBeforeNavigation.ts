"use client";

import { queryClient } from "@/providers/QueryProvider/QueryProvider";
import { syncMemoryLogs } from "@/services/words";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

type UseMemorySyncOptions = {
  userId: string;
  level: string | number;
  day: string | number;
};

export const useMemorySyncBeforeNavigation = ({
  userId,
  level,
  day,
}: UseMemorySyncOptions) => {
  const router = useRouter();

  const [originMemoryLogs, setOriginMemoryLogs] = useState<number[]>([]);
  const [newMemoryLogs, setNewMemoryLogs] = useState<number[]>([]);

  const toggleNewMemoryLog = useCallback((wordId: number) => {
    setNewMemoryLogs((prev) =>
      prev.includes(wordId)
        ? prev.filter((id) => id !== wordId)
        : [...prev, wordId]
    );
  }, []);

  const sync = async () => {
    await syncMemoryLogs(userId, originMemoryLogs, newMemoryLogs);
    await queryClient.invalidateQueries({
      queryKey: ["words", "level", level, "day", day],
    });
  };

  const syncAndPush = async (to: string) => {
    try {
      await sync();
    } catch (e) {
      console.error("페이지 이동 전 동기화 실패:", e);
    } finally {
      router.push(to);
    }
  };

  const syncAndBack = async () => {
    try {
      await sync();
    } catch (e) {
      console.error("뒤로가기 동기화 실패:", e);
    } finally {
      router.back();
    }
  };

  return {
    originMemoryLogs,
    newMemoryLogs,
    setOriginMemoryLogs,
    setNewMemoryLogs,
    toggleNewMemoryLog,
    syncAndPush,
    syncAndBack,
  };
};
