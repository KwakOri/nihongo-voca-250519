import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, originMemoryLogs, newMemoryLogs } = body;

    console.log(
      "userId => ",
      userId,
      "originMemoryLogs => ",
      originMemoryLogs,
      "newMemoryLogs => ",
      newMemoryLogs
    );

    if (
      !userId ||
      !Array.isArray(originMemoryLogs) ||
      !Array.isArray(newMemoryLogs)
    ) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const deletedIds = originMemoryLogs.filter(
      (id: number) => !newMemoryLogs.includes(id)
    );
    const addedIds = newMemoryLogs.filter(
      (id: number) => !originMemoryLogs.includes(id)
    );

    if (deletedIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("word_memory_logs")
        .delete()
        .in("word_id", deletedIds)
        .eq("user_id", userId);

      if (deleteError) {
        console.error("삭제 실패:", deleteError);
      }
    }

    if (addedIds.length > 0) {
      const inserts = addedIds.map((id: number) => ({
        word_id: id,
        user_id: userId,
        is_checked: true,
      }));

      const { error: insertError } = await supabase
        .from("word_memory_logs")
        .insert(inserts);

      if (insertError) {
        console.error("추가 실패:", insertError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("API 처리 중 오류:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
