import { ChangeEvent } from "react";

interface LabeledInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number";
}

export default function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
}: LabeledInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (type === "number") {
      const parsed = parseInt(inputValue, 10);
      onChange(isNaN(parsed) ? 0 : parsed);
    } else {
      onChange(inputValue);
    }
  };

  // 숫자 입력 시 NaN을 방지하기 위해 기본값 처리
  const safeValue =
    type === "number"
      ? typeof value === "number" && !isNaN(value)
        ? value
        : ""
      : value;

  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-sm">{label}</label>
      <input
        type={type}
        className="w-full border p-2 rounded bg-[#2d2d2d] text-white"
        value={safeValue}
        onChange={handleChange}
      />
    </div>
  );
}
