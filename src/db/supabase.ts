// src/supabaseClient.js
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("SUPABASE_URL => ", SUPABASE_URL);
console.log("SUPABASE_ANON_KEY => ", SUPABASE_ANON_KEY);
export const supabase: SupabaseClient = createClient(
  SUPABASE_URL as string,
  SUPABASE_ANON_KEY as string
);
