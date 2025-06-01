"use client";

import { registerUser } from "@/services/auth/signup";
import Link from "next/link";
import { useState } from "react";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    const result = await registerUser({ email, password, name });

    if (!result.success) {
      setError(result.error ?? "알 수 없는 오류");
    } else {
      setMessage("가입이 완료되었습니다! 이메일을 확인해 인증을 완료해주세요.");
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mx-auto p-6 rounded-xl shadow-md bg-[#2d2d2d] space-y-4 text-white">
      <input
        type="text"
        placeholder="이름"
        className="w-full px-4 py-2 rounded bg-[#000000] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        className="w-full px-4 py-2 rounded bg-[#000000] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full px-4 py-2 rounded bg-[#000000] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="w-full px-4 py-2 rounded bg-white text-[#2d2d2d] font-semibold hover:opacity-90 disabled:opacity-50 transition"
        disabled={loading}
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>

      {message && <p className="text-green-400 text-sm">{message}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <Link href={"/login"} className="block">
        <button className="w-full px-4 py-2 rounded border border-white text-white hover:bg-white hover:text-[#2d2d2d] transition">
          이미 계정이 있습니다
        </button>
      </Link>
    </div>
  );
}
