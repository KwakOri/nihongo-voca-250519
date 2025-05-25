"use client";

import { supabase } from "@/db/supabase";

export const getUserProfile = async (userId: string | null) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
};
