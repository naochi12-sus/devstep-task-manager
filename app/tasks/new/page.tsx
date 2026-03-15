"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewTaskPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        // バリデーション（入力チェック）
        if (!title.trim()) {
            setErrorMsg("タスクタイトルは必須です。");
            return;
        }
        if (title.length > 100) {
            setErrorMsg("タスクタイトルは100文字以内で入力してください。");
            return;
        }
        if (description.length > 500) {
            setErrorMsg("タスク詳細は500文字以内で入力してください。");
            return;
        }

        const {
            data: { session },
        } = await supabase.auth.getSession();

        const { error } = await supabase.from("tasks").insert([
            {
                title,
                description: description || null,
                due_date: dueDate || null,
                user_id: session?.user.id,
                is_completed: false,
            },
        ]);

        if (error) {
            setErrorMsg("保存に失敗しました。");
        } else {
            // 保存成功後、タスク一覧画面へ遷移
            router.push("/tasks");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/tasks"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> 一覧へ戻る
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                        タスク作成
                    </h2>

                    {/* バリデーションエラーの表示 */}
                    {errorMsg && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                            {errorMsg}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-6"
                    >
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                タスクタイトル{" "}
                                <span className="text-red-500 text-xs font-normal">
                                    ※必須（100文字以内）
                                </span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                タスク詳細{" "}
                                <span className="text-slate-400 text-xs font-normal">
                                    ※任意（500文字以内）
                                </span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                期限日{" "}
                                <span className="text-slate-400 text-xs font-normal">
                                    ※任意
                                </span>
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                                style={{ cursor: "pointer" }}
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                            <Link
                                href="/tasks"
                                className="px-6 py-3 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                            >
                                キャンセル
                            </Link>
                            <button
                                type="submit"
                                className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
                                style={{ cursor: "pointer" }}
                            >
                                保存する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
