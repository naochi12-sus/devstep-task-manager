"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 追加：画面の自動移動用

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

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
            // 変更：メール認証をオフにしたので、メッセージを変更
            alert("アカウントを作成しました！ログイン画面へ移動します。");
            router.push("/login"); // 追加：OKを押すと自動でログイン画面へ
        }
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>新規登録画面</h1>
            <h2>メールアドレスと８文字以上のパスワードを登録してください。</h2>
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

            {/* ログイン画面へ行くリンク */}
            <div style={{ marginTop: "20px" }}>
                <Link
                    href="/login"
                    style={{ color: "#2563eb", textDecoration: "underline" }}
                >
                    すでにアカウントをお持ちの方はこちら（ログイン画面へ）
                </Link>
            </div>

            {/* トップページに戻るリンク */}
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
