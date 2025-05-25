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
    <div className="w-full max-w-sm space-y-4">
      <input
        type="text"
        placeholder="이름"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="이메일"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full p-2 rounded bg-gray-800 text-white"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="w-full p-2 bg-green-600 rounded text-white"
        disabled={loading}
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>

      {message && <p className="text-green-400 text-sm">{message}</p>}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <Link href={"/login"}>
        <button className="w-full p-2 bg-gray-800 rounded text-white">
          이미 계정이 있습니다
        </button>
      </Link>
    </div>
  );
}
