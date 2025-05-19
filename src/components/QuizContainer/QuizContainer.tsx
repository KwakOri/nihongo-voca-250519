interface QuizContainerProps {
  isLoading: boolean;
}

const QuizContainer = ({}: QuizContainerProps) => {
  return <div>수정중</div>;
};

// {
//   const [selectedValue, setSelectedValue] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [hasNext, setHasNext] = useState<boolean>(true);
//   const [isRoundEnded, setIsRoundEnded] = useState<boolean>(false);
//   const [answerCount, setAnswerCount] = useState<number>(0);
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const lastIndex = quizWords.length - 1;
//   const targetWord = quizWords[currentIndex];
//   const targetId = targetWord.id;

//   const targetSentence = sentences.find(
//     (sentence) => sentence.word_id === targetId
//   );
//   const [selectList, setSelectList] = useState<(string | null)[]>([]);

//   const onAnswerButtonClink = () => {
//     const answer = targetWord?.pronunciation;
//     if (answer === selectedValue) setAnswerCount((prev) => prev + 1);
//     if (currentIndex === lastIndex) {
//       setHasNext(false);
//       return;
//     }
//     setIsRoundEnded(true);
//   };
//   const onNextRoundButtonClick = () => {
//     setCurrentIndex(currentIndex + 1);
//     setIsRoundEnded(false);
//     setSelectedValue("");
//   };
//   const onGoBackButtonClick = () => {
//     const currentPath = location.pathname;
//     const prevPath = currentPath.split("/").slice(0, -1).join("/");
//     navigate(prevPath);
//   };

//   console.log("targetWord => ", targetWord);
//   console.log("targetSentence => ", targetSentence);

//   useEffect(() => {
//     const getRandomThree = (arr: (string | null)[]) => {
//       const shuffled = [...arr].sort(() => 0.5 - Math.random());
//       return shuffled.slice(0, 3);
//     };
//     const targetWord = quizWords[currentIndex];
//     const selectList = getRandomThree(
//       Array.from(
//         new Set(
//           words
//             .filter((word) => {
//               if (word.part === "동사" || word.part === "형용사") {
//                 return word.part === "동사" || word.part === "형용사";
//               } else {
//                 return word.part === targetWord?.part;
//               }
//             })
//             .filter((word) => word.furigana !== targetWord?.furigana)
//             .map((word) => word.furigana)
//         )
//       )
//     );

//     selectList.push(targetWord?.furigana || "");
//     selectList.sort(() => Math.random() - 0.5);

//     setSelectList(selectList);
//     setIsLoading(false);
//   }, [currentIndex]);

//   return isLoading ? (
//     <div className="w-full h-full flex justify-center items-center">
//       <p className="text-2xl text-white">로딩중...</p>
//     </div>
//   ) : (
//     <div className="w-full h-full flex flex-col items-start justify-center gap-2">
//       <div className=" w-full h-10 grid grid-cols-3 gap-2">
//         <button
//           className={
//             "rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs"
//           }
//           onClick={onGoBackButtonClick}
//         >
//           뒤로가기
//         </button>
//         <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs">
//           {currentIndex + 1} / {quizWords.length}
//         </p>
//         <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs">
//           정답 : {answerCount}개
//         </p>
//       </div>
//       {/* Quiz 문장 */}
//       <div
//         className={`rounded bg-[#2d2d2d] w-full h-full flex-1 grow flex flex-col justify-center gap-10 `}
//       >
//         <QuizSentence
//           isRoundEnded={isRoundEnded}
//           tokens={targetSentence?.tokens}
//           targetWord={targetWord?.kanji || ""}
//         />
//       </div>

//       {/* 선택지 */}

//       <div className="w-full grid grid-cols-2 gap-2">
//         {selectList.map((select) => {
//           console.log(select);
//           const word = select || "";
//           return (
//             <div className={"w-full"} key={select}>
//               <label
//                 htmlFor={String(select)}
//                 className={`flex justify-center items-center gap-2 cursor-pointer w-full aspect-video rounded ${
//                   targetWord.furigana === word && isRoundEnded
//                     ? "bg-[#3c559c]"
//                     : selectedValue === word
//                     ? "bg-[#a74040]"
//                     : "bg-[#2d2d2d]"
//                 } ${isRoundEnded ? "pointer-events-none" : ""}`}
//               >
//                 <p className="text-base text-white">{word}</p>
//               </label>
//               <input
//                 id={String(select)}
//                 type="radio"
//                 name="answer"
//                 value={select || ""}
//                 onChange={() => setSelectedValue(word)}
//                 className="hidden"
//               />
//             </div>
//           );
//         })}
//       </div>

//       {/* 제출 버튼 */}
//       {!hasNext ? (
//         <button className="w-full px-4 py-2 text-white bg-[#2d2d2d] rounded">
//           퀴즈 종료
//         </button>
//       ) : isRoundEnded ? (
//         <button
//           className="w-full px-4 py-2 text-white rounded bg-[#3c559c]"
//           onClick={onNextRoundButtonClick}
//         >
//           다음 문제
//         </button>
//       ) : (
//         <button
//           className="w-full px-4 py-2 text-white rounded bg-[#a74040]"
//           onClick={() => onAnswerButtonClink()}
//         >
//           정답입력
//         </button>
//       )}
//     </div>
//   );
// };

export default QuizContainer;
