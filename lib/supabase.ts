import { createBrowserClient } from "@supabase/ssr";

// 確実に .env.local から値を読み込むための設定
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () =>
    createBrowserClient(supabaseUrl, supabaseAnonKey);
