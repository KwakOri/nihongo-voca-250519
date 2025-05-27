"use client";

import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <h1 className="h-20 text-white text-4xl font-black">EASY JLPT</h1>
      <h1 className="text-2xl font-bold mb-4">로그인</h1>
      <AuthForm />
    </main>
  );
}
