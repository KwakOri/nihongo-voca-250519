import Link from "next/link";

const DaysContainer = () => {
  const hash = new Map();
  words.forEach((word) => {
    const day = word.day;
    if (!hash.has(day)) return hash.set(day, 1);
    return hash.set(day, hash.get(day) + 1);
  });

  return (
    <div className={"grid grid-cols-2 gap-2"}>
      {Array.from(hash).map(([day, total]) => {
        const count = records.filter(
          (record) => record.done && record.day === day
        ).length;
        console.log("count => ", count);
        return (
          <Link href={`days/${day}`} key={day}>
            <div
              className={
                "w-full aspect-square flex flex-col justify-evenly bg-[#2d2d2d] rounded-xl hover:brightness-125"
              }
            >
              <p className="text-xl font-bold text-white">DAY {day}</p>
              <p className="text-white font-semibold">
                {count} / {total}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default DaysContainer;
