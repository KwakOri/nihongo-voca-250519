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
      router.push("/");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-xl shadow-md bg-[#2d2d2d] space-y-4 text-white">
      <input
        className="w-full px-4 py-2 rounded bg-[#000000] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        placeholder="이메일"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full px-4 py-2 rounded bg-[#000000] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        placeholder="비밀번호"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full px-4 py-2 rounded bg-white text-[#2d2d2d] font-semibold hover:opacity-90 disabled:opacity-50 transition"
        disabled={loading}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Link href={"/signup"} className="block">
        <button className="w-full px-4 py-2 rounded border border-white text-white hover:bg-white hover:text-[#2d2d2d] transition">
          회원가입
        </button>
      </Link>
    </div>
  );
}
