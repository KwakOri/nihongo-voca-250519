"use client";

import LabeledInput from "@/components/LabeledInput";
import Loading from "@/components/Loading";
import { supabase } from "@/db/supabase";
import { getWordById } from "@/services/words";
import { DBWord } from "@/types/words";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WordEditPage() {
  const router = useRouter();
  const { id } = useParams();
  const wordId = Number(id);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["word", wordId],
    queryFn: () => getWordById(wordId),
  });

  const [wordData, setWordData] = useState<DBWord | null>(null);

  useEffect(() => {
    if (data) setWordData(data);
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (updated: DBWord) => {
      const { error } = await supabase
        .from("words")
        .update({
          word: updated.word,
          meaning: updated.meaning,
          pronunciation: updated.pronunciation,
          tokens: updated.tokens,
          level: updated.level,
          day: updated.day,
          part: updated.part,
        })
        .eq("id", updated.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["word", wordId] });
      alert("수정이 완료되었습니다.");
      router.back();
    },
    onError: (err) => {
      alert("수정 실패: " + err);
    },
  });

  const handleChange = (field: keyof DBWord, value: string | number) => {
    if (!wordData) return;
    setWordData({ ...wordData, [field]: value });
  };

  const handleSave = () => {
    if (!wordData) return;
    updateMutation.mutate(wordData);
  };

  if (isLoading || !wordData) return <Loading />;

  return (
    <div className="w-full h-full overflow-scroll">
      <div className="max-w-xl mx-auto p-4 space-y-4 flex flex-col gap-2 h-full">
        <h1 className="text-xl font-bold">단어 수정</h1>

        <LabeledInput
          label="단어"
          value={wordData.word}
          onChange={(v) => handleChange("word", v)}
        />
        <LabeledInput
          label="의미"
          value={wordData.meaning}
          onChange={(v) => handleChange("meaning", v)}
        />
        <LabeledInput
          label="발음"
          value={wordData.pronunciation}
          onChange={(v) => handleChange("pronunciation", v)}
        />
        <LabeledInput
          label="Tokens"
          value={wordData.tokens}
          onChange={(v) => handleChange("tokens", v)}
        />
        <LabeledInput
          label="레벨"
          type="number"
          value={wordData.level}
          onChange={(v) => handleChange("level", v)}
        />
        <LabeledInput
          label="Day"
          type="number"
          value={wordData.day}
          onChange={(v) => handleChange("day", v)}
        />
        <LabeledInput
          label="품사"
          value={wordData.part}
          onChange={(v) => handleChange("part", v)}
        />

        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white p-2 rounded"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
