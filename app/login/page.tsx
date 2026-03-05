"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase"; // 先ほど作った接続窓口

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("ログイン失敗: " + error.message);
        } else {
            alert("ログイン成功！");
            window.location.href = "/tasks"; // 成功したらタスク画面へ
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>ログイン</h1>
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
            <button onClick={handleLogin}>ログイン</button>
        </div>
    );
}
