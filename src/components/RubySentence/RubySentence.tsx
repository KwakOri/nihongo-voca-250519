interface Token {
  surface: string; // 실제 표면 문자열 (표시되는 텍스트)
  hasKanji: boolean; // 한자가 포함되어 있는지 여부
  kanji?: string; // 한자 (표시용 루비 태그 대상)
  furigana?: string;
}

interface RubySentenceProps {
  tokens: Token[] | undefined;
}

const RubySentence = ({ tokens }: RubySentenceProps) => {
  return (
    <span className="text-white">
      {tokens?.map((token, index) => {
        if (token.hasKanji && token.kanji && token.furigana) {
          return (
            <ruby key={index}>
              {token.kanji}
              <rt className="text-white">{token.furigana}</rt>
            </ruby>
          );
        } else {
          return <span key={index}>{token.surface}</span>;
        }
      })}
    </span>
  );
};

export default RubySentence;
