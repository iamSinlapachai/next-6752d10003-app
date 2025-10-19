import { createClient } from "@supabase/supabase-js";

// อ่านค่าจาก .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// สร้างและ export client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);