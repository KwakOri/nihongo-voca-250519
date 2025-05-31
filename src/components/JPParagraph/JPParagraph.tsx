interface JPParagraphProps {
  tokens: string;
  meaning: string;
  isMeaningVisible: boolean;
  isPronunciationVisible: boolean;
}

const JPParagraph = ({
  tokens,
  meaning,
  isMeaningVisible,
  isPronunciationVisible,
}: JPParagraphProps) => {
  // tokens 파싱하기
  const elements = tokens.split("/").map((pair) => {
    const [surface, furigana] = pair.split(":");
    return { kanji: surface, furigana };
  });

  return (
    <div className="text-white space-y-1 flex flex-col items-center">
      <span className="text-3xl font-semibold">
        {elements.map((element, index) =>
          element.furigana ? (
            <ruby key={index}>
              {element.kanji}
              {
                <rt className={`${!isPronunciationVisible && " opacity-0"}`}>
                  {element.furigana}
                </rt>
              }
            </ruby>
          ) : (
            <span key={index}>{element.kanji}</span>
          )
        )}
      </span>
      <p
        className={`text-xl text-gray-300 ${!isMeaningVisible && " opacity-0"}`}
      >
        {meaning}
      </p>
    </div>
  );
};

export default JPParagraph;
