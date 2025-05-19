interface DayCardProps {
  day: number;
  total: number;
  count: number;
}

const DayCard = ({ day, total, count }: DayCardProps) => {
  return (
    <div className={"w-full aspect-square flex flex-col justify-between"}>
      <p>DAY {day}</p>
      <p>
        {count}/{total}
      </p>
    </div>
  );
};

export default DayCard;
