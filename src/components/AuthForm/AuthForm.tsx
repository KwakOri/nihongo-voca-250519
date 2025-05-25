"use client";

import { supabase } from "@/db/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      router.push("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <input
        className="w-full p-2 rounded bg-gray-800 text-white"
        placeholder="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 rounded bg-gray-800 text-white"
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-600 rounded text-white"
        disabled={loading}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Link href={"/signup"}>
        <button className="w-full p-2 bg-gray-800 rounded text-white">
          회원가입
        </button>
      </Link>
    </div>
  );
}
