"use client";

import AuthForm from "@/components/AuthForm";
import { supabase } from "@/db/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <AuthForm />
    </main>
  );
}
