import { supabase } from "@/db/supabase";

export async function registerUser({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) {
  // 1. 회원가입
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://easyjlpt.site/login",
    },
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  // 2. 프로필 테이블에 정보 저장
  const user = signUpData.user;

  if (!user) {
    return {
      success: false,
      error: "회원가입은 되었지만 사용자 정보가 없습니다.",
    };
  }

  const { error: profileError } = await supabase.from("profiles").insert([
    {
      id: user.id, // profiles 테이블의 PK
      name,
      email: user.email,
      created_at: new Date().toISOString(),
    },
  ]);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  return { success: true, userId: user.id };
}
