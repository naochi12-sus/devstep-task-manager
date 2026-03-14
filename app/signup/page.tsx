"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSignup = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            alert("登録失敗: " + error.message);
        } else {
            setIsSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200 p-4">
            {/* カードの背景をダークカラー（slate-800）に反転！ */}
            <div className="max-w-md w-full bg-slate-800/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border border-slate-700">
                {/* ロゴとタイトルのセクション */}
                <div className="flex items-center justify-center gap-3 mb-2">
                    <Image
                        src="/Logo1.png"
                        alt="Our Goal ロゴ"
                        width={48}
                        height={48}
                        className="rounded-full shadow-md hover:scale-105 transition-transform"
                    />
                    {/* ダーク背景に映えるよう、文字のグラデーションを少し明るめに調整 */}
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400 tracking-tight">
                        Our Goal
                    </h1>
                </div>

                {isSubmitted ? (
                    // 【送信完了後の画面（ダークテーマ用）】
                    <div className="mt-8 text-center animate-fade-in">
                        <div className="bg-slate-700 border border-slate-600 rounded-xl p-6 mb-8">
                            <h2 className="text-lg font-bold text-white mb-3">
                                確認メールを送信しました
                            </h2>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                <strong className="text-indigo-400">
                                    {email}
                                </strong>{" "}
                                宛に
                                <br />
                                登録確認用のメールをお送りしました。
                                <br />
                                メール内のリンクをクリックして、
                                <br />
                                登録を完了させてください。
                            </p>
                        </div>
                        <Link
                            href="/login"
                            className="inline-block bg-white hover:bg-slate-100 text-indigo-700 font-bold py-3 px-8 rounded-xl transition-all shadow-sm"
                        >
                            ログイン画面へ進む
                        </Link>
                    </div>
                ) : (
                    // 【最初の入力フォーム画面】
                    <>
                        <p className="text-sm font-medium text-slate-300 mt-1 mb-8 text-center">
                            アカウントを作成して始めましょう
                        </p>

                        <div className="space-y-4">
                            <div>
                                {/* 入力欄は真っ白に反転し、文字色は黒（slate-900）に */}
                                <input
                                    type="email"
                                    placeholder="メールアドレス"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="パスワード（8文字以上）"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                />
                            </div>

                            {/* ボタンの色は元のインディゴに戻しました */}
                            <button
                                onClick={handleSignup}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 mt-2"
                            >
                                アカウントを作成
                            </button>
                        </div>

                        {/* リンクの文字色もダーク背景に合わせて調整 */}
                        <div className="mt-8 text-center space-y-3">
                            <Link
                                href="/login"
                                className="block text-sm text-indigo-400 hover:text-indigo-300 transition-colors hover:underline"
                            >
                                すでにアカウントをお持ちの方はこちら
                            </Link>
                            <Link
                                href="/"
                                className="block text-sm text-slate-400 hover:text-slate-300 transition-colors"
                            >
                                ← トップページに戻る
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
