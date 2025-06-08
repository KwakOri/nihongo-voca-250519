"use client";

import LabeledInput from "@/components/LabeledInput";
import { supabase } from "@/db/supabase";
import { DBWord } from "@/types/words";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function WordAddPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { level, day } = useParams();

  const [wordData, setWordData] = useState<Omit<DBWord, "id">>({
    word: "",
    meaning: "",
    pronunciation: "",
    tokens: "",
    level: Number(level),
    day: Number(day),
    part: "",
  });

  const addMutation = useMutation({
    mutationFn: async (newWord: Omit<DBWord, "id">) => {
      const { error } = await supabase.from("words").insert(newWord);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["words", level, day] });
      alert("단어가 추가되었습니다.");
      router.back();
    },
    onError: (err) => {
      alert("추가 실패: " + err.message);
    },
  });

  const handleChange = (
    field: keyof Omit<DBWord, "id">,
    value: string | number
  ) => {
    setWordData({ ...wordData, [field]: value });
  };

  const handleSave = () => {
    addMutation.mutate(wordData);
  };

  return (
    <div className="w-full h-full overflow-scroll">
      <div className="max-w-xl mx-auto p-4 space-y-4 flex flex-col gap-2 h-full">
        <h1 className="text-xl font-bold">단어 추가</h1>

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
          className="w-full bg-green-600 text-white p-2 rounded"
          disabled={addMutation.isPending}
        >
          {addMutation.isPending ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
