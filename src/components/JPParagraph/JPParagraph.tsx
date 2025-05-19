interface JPParagraphProps {
  tokens: string;
  meaning: string;
}

const JPParagraph = ({ tokens, meaning }: JPParagraphProps) => {
  // tokens 파싱하기
  const elements = tokens.split("/").map((pair) => {
    const [surface, furigana] = pair.split(":");
    return { kanji: surface, furigana };
  });

  return (
    <div className="text-white space-y-1 flex flex-col items-center">
      <span className="text-xl font-semibold">
        {elements.map((element, index) =>
          element.furigana ? (
            <ruby key={index}>
              {element.kanji}
              <rt className="text-white mb-1 text-center">
                {element.furigana}
              </rt>
            </ruby>
          ) : (
            <span key={index}>{element.kanji}</span>
          )
        )}
      </span>
      <p className="text-sm text-gray-300">{meaning}</p>
    </div>
  );
};

export default JPParagraph;
