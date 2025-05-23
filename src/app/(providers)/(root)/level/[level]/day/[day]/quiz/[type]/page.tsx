"use client";

import QuizCard from "@/components/QuizCard/QuizCard";
import QuizNavBar from "@/components/QuizNavBar/QuizNavBar";
import { useGetWordsWithQuizByDay } from "@/queries/words";
import { DBWordWithQuiz } from "@/types/words";
import { useParams } from "next/navigation";
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
  const { level, day, type } = useParams();
  const { data, isPending } = useGetWordsWithQuizByDay({
    day: Number(day),
  });

  console.log(data);
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

  const nextQuiz = (isCorrect: boolean) => {
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
    const newQuiz = generateNewQuiz(
      data?.[newQuizMeta.quizOrder[newQuizMeta.currentIndex]]
    );
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
    const selectBase = word.quiz
      .filter((item) => item.type === type)[0]
      .selects.split(",")
      .map((item, index) => ({
        id: index + 1,
        surface: item,
        isCorrect: false,
      }));

    const selects = shuffleArray(selectBase)
      .filter((item) => item.surface !== answer)
      .slice(0, 3);
    selects.push({ id: 0, surface: answer, isCorrect: true });
    const shuffledSelects = shuffleArray(selects);

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

  useEffect(() => {
    if (!isPending) {
      if (data?.length === 0) {
        return alert("문제가 없습니다.");
      }
      const savedQuizMeta = getQuizMetaInLocalStorage();
      const savedQuiz = getQuizInLocalStorage();
      if (!savedQuizMeta || !savedQuiz) {
        const newQuizMeta = generateNewQuizMeta();
        const newQuizBase: DBWordWithQuiz =
          data?.[newQuizMeta.quizOrder[newQuizMeta.currentIndex]];
        const newQuiz = generateNewQuiz(newQuizBase);
        setQuizMetaInLocalStorage(newQuizMeta);
        setQuizMeta(newQuizMeta);
        setQuizInLocalStorage(newQuiz);
        setQuiz(newQuiz);
      } else {
        setQuizMeta(savedQuizMeta);
        setQuiz(savedQuiz);
      }
      return setIsQuizStarted(true);
    }
  }, [isPending]);

  if (!isQuizStarted || isPending) return <div>Loading...</div>;

  console.log("quizMeta.total => ", quizMeta.total);
  return (
    <div className="w-hull h-full flex flex-col">
      <QuizNavBar total={quizMeta.total} correct={quizMeta.currentIndex + 1} />
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
