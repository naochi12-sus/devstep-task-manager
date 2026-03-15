"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image"; // Next.jsの画像部品

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert("ログイン失敗: " + error.message);
        } else {
            router.push("/tasks");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4">
            <div className="max-w-md w-full bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-white/50">
                {/* ロゴとタイトルのセクション */}
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Image
                        src="/Logo1.png"
                        alt="Our Goal ロゴ"
                        width={48}
                        height={48}
                        className="rounded-full shadow-sm hover:scale-105 transition-transform"
                    />
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-cyan-500 tracking-tight">
                        Our Goal
                    </h1>
                </div>

                <p className="text-sm font-medium text-slate-500 mt-1 mb-8 text-center">
                    タスク管理システム
                </p>

                {/* フォームのエリア */}
                <div className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="メールアドレス"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="パスワード"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 mt-2"
                        style={{ cursor: "pointer" }}
                    >
                        ログイン
                    </button>
                </div>

                {/* リンクのエリア */}
                <div className="mt-8 text-center space-y-3">
                    <Link
                        href="/signup"
                        className="block text-sm text-slate-500 hover:text-indigo-600 transition-colors hover:underline"
                    >
                        まだアカウントをお持ちでない方はこちら
                    </Link>
                    <Link
                        href="/"
                        className="block text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        ← トップページに戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
