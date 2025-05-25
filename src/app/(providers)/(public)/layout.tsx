"use client";

import { supabase } from "@/db/supabase";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        alert("이미 로그인되어 있습니다.");
        router.replace("/");
      }
    });
  }, [router]);
  return <>{children}</>;
};

export default Layout;
