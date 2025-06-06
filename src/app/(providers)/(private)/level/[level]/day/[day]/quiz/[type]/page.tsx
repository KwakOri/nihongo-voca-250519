"use client";

import Loading from "@/components/Loading";
import QuizCard from "@/components/QuizCard/QuizCard";
import QuizNavBar from "@/components/QuizNavBar/QuizNavBar";
import { QUIZ_PROGRESS_KEY, useQuizzesByType } from "@/queries/quiz";
import { saveQuizData } from "@/services/quiz";
import { DBWordWithQuiz } from "@/types/words";
import { useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export interface TScore {
  wordId: number;
  order: number;
  isCorrect: boolean;
}

export interface TQuizMeta {
  level: number;
  day: number;
  type: number;
  quizOrder: number[];
  total: number;
  currentIndex: number;
  scoreBoard: TScore[];
}

export interface TQuizSelect {
  id: number;
  surface: string;
  isCorrect: boolean;
}

export interface TQuiz {
  quiz: string;
  wordId: number;
  answer: string;
  quizOrder: number;
  selects: TQuizSelect[];
}

const QuizPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { level, day, type } = useParams();
  const { data, isPending } = useQuizzesByType({
    day: Number(day),
    type: String(type),
    level: Number(level),
  });

  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [quizMeta, setQuizMeta] = useState<TQuizMeta>({
    total: 0,
    level: 0,
    day: 0,
    type: 0,
    quizOrder: [],
    currentIndex: 0,
    scoreBoard: [],
  });

  const [quiz, setQuiz] = useState<TQuiz>({
    wordId: 0,
    quiz: "",
    answer: "",
    quizOrder: 0,
    selects: [],
  });

  function generateQuizChoicesWithTail(
    answer: string,
    selectsRaw: string,
    part: string,
    word: string
  ): string[] {
    console.log(part);
    const parts = selectsRaw.split("/").map((part) => part.trim());

    // 유효한 자리만 추출
    const validIndexes = parts
      .map((part, index) => {
        const options = part
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        return options.length > 1 ? index : null;
      })
      .filter((i): i is number => i !== null);

    if (validIndexes.length === 0) {
      throw new Error("출제할 수 있는 자리가 없습니다.");
    }

    // 바꿀 자릿수 무작위 선택
    const targetIndex =
      validIndexes[Math.floor(Math.random() * validIndexes.length)];
    const targetOptions = parts[targetIndex].split(",").map((s) => s.trim());
    const distractors = targetOptions.slice(1, 4); // 최대 3개 오답

    // 정답 분리
    const chars = Array.from(word);

    // 어미 분리 여부 판단
    const shouldPreserveTail =
      part === "동사" || part === "형용사" || part === "형용동사";

    let tail = "";
    let baseChars = chars;

    if (shouldPreserveTail) {
      const kanjiRegex = /[\u4E00-\u9FFF]/;
      const splitIndex = chars.findIndex((c) => !kanjiRegex.test(c));
      if (splitIndex > -1) {
        baseChars = chars.slice(0, splitIndex);
        tail = chars.slice(splitIndex).join("");
      }
    }

    // 오답 선택지 생성
    const choices = distractors.map((distractor) => {
      const newChars = [...baseChars];
      newChars[targetIndex] = distractor;
      return newChars.join("") + tail;
    });

    return [answer, ...choices];
  }

  const nextQuiz = async (isCorrect: boolean) => {
    const newScoreBoard = [...quizMeta.scoreBoard];
    newScoreBoard.push({
      wordId: quiz.wordId,
      order: quizMeta.currentIndex,
      isCorrect: isCorrect,
    });
    const newQuizMeta = {
      ...quizMeta,
      currentIndex: quizMeta.currentIndex + 1,
      scoreBoard: newScoreBoard,
    };
    setQuizMetaInLocalStorage(newQuizMeta);
    setQuizMeta(newQuizMeta);

    if (newQuizMeta.currentIndex === newQuizMeta.total) {
      await saveQuizData({
        ...newQuizMeta,
        scoreBoard: newQuizMeta.scoreBoard.map((score) => ({
          wordId: score.wordId,
          order: score.order,
          isCorrect: score.isCorrect,
        })),
      });
      queryClient.invalidateQueries({ queryKey: QUIZ_PROGRESS_KEY });
      router.push(`/level/${level}/day/${day}`);
      return;
    }

    const currentWord = data?.[newQuizMeta.quizOrder[newQuizMeta.currentIndex]];
    if (!currentWord) return;

    const newQuiz = generateNewQuiz(currentWord);
    setQuizInLocalStorage(newQuiz);
    setQuiz(newQuiz);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const generateNewQuizMeta = () => {
    const quizLength = data?.length ?? 0;
    const quizOrders = Array.from({ length: quizLength }, (_, i) => i);
    const shuffledOrders = shuffleArray(quizOrders);
    const newQuizData: TQuizMeta = {
      total: quizLength,
      level: Number(level),
      day: Number(day),
      type: Number(type),
      quizOrder: shuffledOrders,
      currentIndex: 0,
      scoreBoard: [],
    };
    return newQuizData;
  };

  const generateNewQuiz = (word: DBWordWithQuiz) => {
    let answer;
    let quiz;
    let selectBase;
    let selects;
    switch (type) {
      case "1":
        answer = word.pronunciation;
        break;
      case "2":
        answer = word.tokens.split(":")[0];
        break;
      case "3":
        answer = word.meaning;
        break;
      default:
        answer = "";
    }
    switch (type) {
      case "1":
        quiz = word.word;
        break;
      case "2":
        quiz = word.pronunciation;
        break;
      case "3":
        quiz = word.word;
        break;
      default:
        quiz = "";
    }

    switch (type) {
      case "2":
        selectBase = generateQuizChoicesWithTail(
          answer,
          word.quiz.filter((item) => item.type === type)[0].selects,
          word.part,
          word.word
        ).map((item, index) => ({
          id: index + 1,
          surface: item,
          isCorrect: false,
        }));
        selects = shuffleArray(selectBase || [])
          .filter((item) => item.surface !== answer)
          .slice(0, 3);
        selects.push({ id: 0, surface: word.word, isCorrect: true });
        break;
      default:
        selectBase = word.quiz
          .filter((item) => item.type === type)[0]
          .selects.split(",")
          .map((item, index) => ({
            id: index + 1,
            surface: item,
            isCorrect: false,
          }));
        selects = shuffleArray(selectBase || [])
          .filter((item) => item.surface !== answer)
          .slice(0, 3);
        selects.push({ id: 0, surface: answer, isCorrect: true });
    }

    const shuffledSelects = shuffleArray(selects || []);

    const newQuiz: TQuiz = {
      wordId: word.id,
      quiz,
      answer,
      quizOrder: 0,
      selects: shuffledSelects,
    };
    return newQuiz;
  };

  const setQuizInLocalStorage = (quiz: TQuiz) => {
    localStorage.setItem(`quiz`, JSON.stringify(quiz));
  };
  const getQuizInLocalStorage = () => {
    const savedQuiz = localStorage.getItem(`quiz`);
    if (!savedQuiz) return null;
    const parsedData: TQuiz = JSON.parse(savedQuiz);
    return parsedData;
  };

  const getQuizMetaInLocalStorage = () => {
    const savedQuizData = localStorage.getItem(`quiz-meta`);
    if (!savedQuizData) return null;
    const parsedData: TQuizMeta = JSON.parse(savedQuizData);
    return parsedData;
  };

  const setQuizMetaInLocalStorage = (quizData: TQuizMeta) => {
    localStorage.setItem(`quiz-meta`, JSON.stringify(quizData));
  };

  const handleBack = async () => {
    try {
      const raw = localStorage.getItem("quiz-meta");
      if (!raw) return;
      const meta = JSON.parse(raw);
      await saveQuizData(meta);
      router.push(`/level/${level}/day/${day}`);
    } catch (error) {
      console.error("뒤로가기 중 저장 실패:", error);
      router.push(`/level/${level}/day/${day}`);
    }
  };

  useEffect(() => {
    if (!isPending) {
      if (data?.length === 0) {
        return alert("문제가 없습니다.");
      }
      const savedQuizMeta = getQuizMetaInLocalStorage();
      const savedQuiz = getQuizInLocalStorage();
      if (!savedQuizMeta) {
        const newQuizMeta = generateNewQuizMeta();
        const currentWord =
          data?.[newQuizMeta.quizOrder[newQuizMeta.currentIndex]];
        if (!currentWord) return;
        const newQuiz = generateNewQuiz(currentWord);
        setQuizMetaInLocalStorage(newQuizMeta);
        setQuizMeta(newQuizMeta);
        setQuizInLocalStorage(newQuiz);
        setQuiz(newQuiz);
      } else if (!savedQuiz) {
        const currentWord =
          data?.[savedQuizMeta.quizOrder[savedQuizMeta.currentIndex]];
        if (!currentWord) return;
        const newQuiz = generateNewQuiz(currentWord);
        setQuizInLocalStorage(newQuiz);
        setQuiz(newQuiz);
      } else {
        setQuizMeta(savedQuizMeta);
        setQuiz(savedQuiz);
      }
      return setIsQuizStarted(true);
    }
  }, [isPending]);

  useEffect(() => {
    const handleUnload = async () => {
      try {
        const raw = localStorage.getItem("quiz-meta");
        if (!raw) return;

        const meta = JSON.parse(raw);

        // 아직 퀴즈가 모두 끝나지 않았을 경우만 저장
        if (meta.currentIndex < meta.total) {
          await saveQuizData({
            ...meta,
            scoreBoard: meta.scoreBoard.map((s: TScore) => ({
              wordId: s.wordId,
              order: s.order,
              isCorrect: s.isCorrect,
            })),
          });
          queryClient.invalidateQueries({ queryKey: QUIZ_PROGRESS_KEY });
        }
      } catch (e) {
        console.error("quiz-meta 저장 실패:", e);
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  if (!isQuizStarted || isPending) return <Loading />;

  return (
    <div className="w-hull h-full flex flex-col">
      <QuizNavBar
        total={quizMeta.total}
        correct={quizMeta.currentIndex + 1}
        onBack={handleBack}
      />
      <QuizCard
        quiz={quiz}
        type={quizMeta.type}
        nextQuiz={nextQuiz}
        isLastQuiz={quizMeta.total - 1 < quizMeta.currentIndex}
      />
    </div>
  );
};

export default QuizPage;
