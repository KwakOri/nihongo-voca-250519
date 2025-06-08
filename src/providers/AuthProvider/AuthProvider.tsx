"use client";

import { supabase } from "@/db/supabase";
import { useUserProfile } from "@/queries/auth/profiles";
import { DBProfile } from "@/types/profiles";
import { createContext, useContext, useEffect, useState } from "react";

interface Session {
  user: {
    id: string;
    email?: string;
  };
}

type AuthContextType = {
  session: Session | null;
  userId: string | null;
  profile: DBProfile | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  userId: null,
  profile: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 초기 세션 조회
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUserId(data.session?.user?.id ?? null);
    });

    // 로그인/로그아웃 상태 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUserId(session?.user?.id ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: profile, isLoading } = useUserProfile(userId);

  return (
    <AuthContext.Provider value={{ session, userId, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
