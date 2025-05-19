import { useRouter } from "next/navigation";

interface LevelNavBarProps {
  level: number;
}

const LevelNavBar = ({ level }: LevelNavBarProps) => {
  const navigate = useRouter();

  const onGoBackButtonClick = () => {
    navigate.back();
  };

  return (
    <div className="sticky shrink-0 z-10 top-0 w-full h-12 grid grid-cols-3 gap-2 bg-black pb-2">
      <button
        className={
          "rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs hover:brightness-125"
        }
        onClick={onGoBackButtonClick}
      >
        뒤로가기
      </button>
      <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs ">
        N{level}
      </p>
      <p className="rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs hover:brightness-125">
        미정
      </p>
    </div>
  );
};

export default LevelNavBar;
