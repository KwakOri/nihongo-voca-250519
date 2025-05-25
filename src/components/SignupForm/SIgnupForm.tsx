"use client";

import { supabase } from "@/db/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSignup = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://easyjlpt.site/login",
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("인증 메일을 발송했습니다.");
      alert("이메일 확인을 위해 메일함을 확인해주세요.");
      router.push("/login"); // 자동 리디렉션 시 사용
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
        onClick={handleSignup}
        className="w-full p-2 bg-green-600 rounded text-white"
        disabled={loading}
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>
      {message && <p className="text-sm text-yellow-400">{message}</p>}
      <Link href={"/login"}>
        <button className="w-full p-2 bg-gray-800 rounded text-white">
          이미 계정이 있습니다
        </button>
      </Link>
    </div>
  );
}
