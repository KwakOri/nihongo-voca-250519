export interface WordData {
  id: number;
  word: string;
  meaning: string;
  level: number;
  pronunciation: string;
  part: string;
  day: number;
  prefix?: string | null;
  kanji?: string | null;
  furigana?: string | null;
  hiragana?: string | null;
}

interface RubyWord {
  word: WordData;
}

const RubyWord = ({ word }: RubyWord) => {
  const { prefix, kanji, furigana, hiragana, meaning } = word;

  return (
    <div className="text-white space-y-1">
      <span className="text-xl font-semibold">
        {prefix && <span>{prefix}</span>}
        {kanji && furigana ? (
          <ruby>
            {kanji}
            <rt className="text-white ">{furigana}</rt>
          </ruby>
        ) : (
          kanji
        )}
        {hiragana && <span>{hiragana}</span>}
      </span>
      <p className="text-sm text-gray-300">{meaning}</p>
    </div>
  );
};

export default RubyWord;
