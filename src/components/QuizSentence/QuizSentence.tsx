import { Fragment } from "react/jsx-runtime";

interface QuizSentenceProps {
  type: string;
  targetWord: string;
  tokens: (string | [string, string])[] | undefined;
  isRoundEnded: boolean;
}

const QuizSentence = ({
  tokens,
  targetWord,
  isRoundEnded,
}: QuizSentenceProps) => {
  return (
    <span className="text-white">
      {tokens?.map((token, i) => {
        let surface: string;
        let reading: string | null = null;

        // token이 배열인지 확인
        if (Array.isArray(token)) {
          [surface, reading] = token;
        } else {
          surface = token;
        }

        const isTarget = surface === targetWord;

        return (
          <Fragment key={i}>
            {reading ? (
              <ruby className={isTarget ? "underline underline-offset-2" : ""}>
                {surface}
                {isRoundEnded && <rt className="text-white">{reading}</rt>}
              </ruby>
            ) : (
              <span className={isTarget ? "underline underline-offset-2" : ""}>
                {surface}
              </span>
            )}
          </Fragment>
        );
      })}
    </span>
  );
};

export default QuizSentence;
