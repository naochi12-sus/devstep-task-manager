"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        const supabase = createClient();
        // Supabaseに新しいユーザーを登録する命令
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert("登録失敗: " + error.message);
        } else {
            alert("確認メールを送信しました（設定によっては即時登録されます）");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>新規登録画面</h1>
            <h2>メールアドレスと８文字のパスワードを登録してください。</h2>
            <input
                type="email"
                placeholder="メールアドレス"
                onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
                type="password"
                placeholder="パスワード"
                onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button onClick={handleSignup}>アカウント作成</button>
        </div>
    );
}
