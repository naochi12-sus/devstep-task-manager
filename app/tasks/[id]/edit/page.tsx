"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// URLから [id] の部分を受け取るための設定
export default function EditTaskPage() {
    // 1. 各データの初期状態
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    // URL から id を取得
    const params = useParams();
    const taskId = params.id as string;

    // 画面が開いた時の処理
    useEffect(() => {
        if (!taskId) return;

        const fetchData = async () => {
            // 1. まずlocalStorageから下書きを探す
            const savedData = localStorage.getItem(`task-draft-${taskId}`);

            if (savedData) {
                // 下書きがあればそれをセット
                const { title, description, dueDate } = JSON.parse(savedData);
                setTitle(title);
                setDescription(description);
                setDueDate(dueDate);
                setLoading(false); // 読み込み完了
            } else {
                // 2. 下書きがなければデータベースから取得
                const { data, error } = await supabase
                    .from("tasks")
                    .select("*")
                    .eq("id", taskId)
                    .single();

                if (error) {
                    setErrorMsg("データの読み込みに失敗しました。");
                } else if (data) {
                    setTitle(data.title);
                    setDescription(data.description || "");
                    setDueDate(data.due_date || "");
                }
                setLoading(false); // 読み込み完了
            }
        };

        fetchData();
    }, [taskId, supabase]);

    // 2. 入力中：常にlocalStorageへ自動保存（下書き）
    useEffect(() => {
        if (!loading) {
            localStorage.setItem(
                `task-draft-${taskId}`,
                JSON.stringify({ title, description, dueDate }),
            );
        }
    }, [title, description, dueDate, loading, taskId]);

    // 3. 送信時：バリデーション ＋ try...catchによる安全な通信
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        // 【バリデーション】
        if (!title.trim()) {
            setErrorMsg("タスクタイトルは必須です。");
            return;
        }
        if (title.length > 200) {
            setErrorMsg("タスクタイトルは200文字以内で入力してください。");
            return;
        }
        if (description.length > 2000) {
            setErrorMsg("タスク詳細は2000文字以内で入力してください。");
            return;
        }

        setIsSaving(true);

        try {
            const now = new Date().toISOString();
            const { error } = await supabase
                .from("tasks")
                .update({
                    title,
                    description,
                    due_date: dueDate,
                    updated_at: now,
                })
                .eq("id", taskId);

            if (error) throw new Error(error.message);

            // 成功時は下書きを消して一覧へ
            localStorage.removeItem(`task-draft-${taskId}`);
            router.push("/tasks");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setErrorMsg(`保存に失敗しました: ${err.message}`);
            } else {
                setErrorMsg("予期せぬエラーが発生しました。");
            }
        } finally {
            setIsSaving(false);
        }
    };

    if (loading)
        return <div className="p-10 text-center">データを読み込み中...</div>;

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/tasks"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> 一覧へ戻る
                </Link>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">
                        タスク編集
                    </h2>

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
                                    ※必須（200文字以内）
                                </span>
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                            />
                            <p className="text-right text-sm  text-slate-700 mt-1">
                                あと {200 - title.length} 文字
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                タスク詳細{" "}
                                <span className=" text-slate-700 text-xs font-normal">
                                    ※任意（2000文字以内）
                                </span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={5}
                                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none text-slate-900"
                            />
                            <p className="text-right text-sm  text-slate-700 mt-1">
                                あと {2000 - description.length} 文字
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                期限日{" "}
                                <span className=" text-slate-700 text-xs font-normal">
                                    ※任意
                                </span>
                            </label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900"
                                style={{ cursor: "pointer" }} // 強制的に指マークにする
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
                                disabled={isSaving} // ★保存中は押せなくする
                                className={`px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm transition-colors ${
                                    isSaving
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-indigo-700"
                                }`}
                            >
                                {isSaving ? "保存中..." : "変更を保存する"}{" "}
                                {/* ★文字も変わります */}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
