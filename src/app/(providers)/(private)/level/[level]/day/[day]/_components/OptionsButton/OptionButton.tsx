"use client";

import { useAuth } from "@/providers/AuthProvider";
import { queryClient } from "@/providers/QueryProvider/QueryProvider";
import { deleteWord } from "@/services/words";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { SlOptionsVertical } from "react-icons/sl";

const OptionButton = ({ id }: { id: number }) => {
  const { profile } = useAuth();
  const router = useRouter();
  const { level, day } = useParams();
  const [isClosed, setIsClosed] = useState(true);

  const checkIsAdmin = () => {
    return profile?.roll === "admin";
  };

  const handleDelete = async () => {
    if (!checkIsAdmin()) return alert("관리자만 삭제할 수 있습니다.");
    const isConfirmed = confirm("삭제하시겠습니까?");
    if (!isConfirmed) return;
    await deleteWord(id);
    queryClient.invalidateQueries({
      queryKey: ["words", "level", level, "day", day],
    });
  };

  const handleEdit = () => {
    if (!checkIsAdmin()) return alert("관리자만 수정할 수 있습니다.");
    const isConfirmed = confirm("수정하시겠습니까?");
    if (!isConfirmed) return;
    queryClient.invalidateQueries({
      queryKey: ["words", "level", level, "day", day],
    });
    router.push(`/level/${level}/day/${day}/edit/${id}`);
  };
  return (
    <>
      <button className="p-2 z-10" onClick={() => setIsClosed(!isClosed)}>
        <div
          className={`rounded-lg w-6 aspect-square flex justify-center items-center 
          ${isClosed ? "bg-[#e9e9e9]" : "bg-[#a5a5a5]"}
        `}
        >
          <SlOptionsVertical color={"#2d2d2d"} />
        </div>
      </button>
      {!isClosed && (
        <div className="absolute top-full left-0 w-40 bg-black/50 rounded-lg shadow-lg backdrop-blur-sm z-10">
          <div className="flex flex-col gap-2 p-2">
            <button
              className="flex gap-2 items-center rounded-lg p-2"
              onClick={handleDelete}
            >
              <FaTrash color="white" />
              <p className="text-sm text-white font-bold w-full text-center">
                삭제하기
              </p>
            </button>
            <button
              className="flex gap-2 items-center rounded-lg p-2"
              onClick={handleEdit}
            >
              <FaEdit color="white" />
              <p className="text-sm text-white font-bold w-full text-center">
                수정하기
              </p>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default OptionButton;
