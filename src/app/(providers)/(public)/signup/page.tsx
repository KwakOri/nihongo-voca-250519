"use client";

import SignupForm from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <SignupForm />
    </main>
  );
}
