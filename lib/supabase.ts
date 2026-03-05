import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// アプリ全体で使う「Supabaseくん」を呼び出すための設定
export const createClient = () => createClientComponentClient();
