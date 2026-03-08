"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 移動のための部品
import { createClient } from "@/lib/supabase";
import Link from "next/link"; // 追加：リンクを使うための部品

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter(); // 移動機能を準備

    const handleLogin = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("ログイン失敗: " + error.message);
        } else {
            // 成功したら /tasks ページへ自動でジャンプ！
            router.push("/tasks");
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>ログイン画面</h1>
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

            {/* 追加：新規登録画面へ行くリンク */}
            <div style={{ marginTop: "20px" }}>
                <Link
                    href="/signup"
                    style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                    まだアカウントをお持ちでない方はこちら（新規登録画面へ）
                </Link>
            </div>

            {/* 追加：トップページに戻るリンク */}
            <div style={{ marginTop: "20px" }}>
                <Link
                    href="/"
                    style={{
                        color: "#6b7280",
                        textDecoration: "underline",
                        fontSize: "14px",
                    }}
                >
                    ← トップページに戻る
                </Link>
            </div>
        </div>
    );
}
