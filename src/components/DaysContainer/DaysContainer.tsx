import { useGetWordsCountByDay } from "@/queries/words";
import Link from "next/link";
import { useParams } from "next/navigation";

const DaysContainer = () => {
  const { level } = useParams();

  const { data, isPending } = useGetWordsCountByDay();

  if (!data || isPending) return <div>Loading...</div>;

  return (
    <div className={"grid grid-cols-2 gap-2"}>
      {data.map(({ day, count, total }) => {
        return (
          <Link href={`${level}/day/${day}`} key={day}>
            <div
              className={
                "w-full aspect-square flex flex-col justify-evenly items-center bg-[#2d2d2d] rounded-xl hover:brightness-125"
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
