import { supabase } from "@/db/supabase";

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("로그아웃 실패:", error.message);
    throw error;
  }
}
