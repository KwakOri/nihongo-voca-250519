import Link from "next/link";

const Levels = () => {
  const levels = [1, 2, 3, 4];
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-10 grid grid-cols-3 gap-2">
        <Link
          href="/"
          className={
            "rounded bg-[#2d2d2d] w-full h-full flex justify-center items-center text-white text-xs"
          }
        >
          뒤로가기
        </Link>
      </div>
      {levels.map((level, index) => (
        <Link href={`level/${level}`} key={index}>
          <p className="w-full h-20 rounded bg-[#2d2d2d] flex justify-center items-center text-white text-xl">
            N{level}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Levels;
