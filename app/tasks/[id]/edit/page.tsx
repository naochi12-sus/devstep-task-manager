"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// URLから [id] の部分を受け取るための設定
export default function EditTaskPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(true);

    const router = useRouter();
    const supabase = createClient();

    // URL から id を取得
    const params = useParams();
    const taskId = params.id as string;

    // 画面が開いた時に、該当するタスクのデータを1件だけ取ってくる
    useEffect(() => {
        // IDがまだ取れていない時は何もしない
        if (!taskId) return;

        const fetchTask = async () => {
            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("id", taskId) // 取得した taskId を使う
                .single(); // 1件だけ取得

            if (error) {
                setErrorMsg("データの読み込みに失敗しました。");
            } else if (data) {
                // 取ってきたデータを入力欄にセットする
                setTitle(data.title);
                setDescription(data.description || "");
                setDueDate(data.due_date || "");
            }
            setLoading(false);
        };

        fetchTask();
    }, [params.id, supabase]);

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

        // 更新日時用に「今の時間」を取得
        const now = new Date().toISOString();

        // データベースを上書き更新（Update）
        const { error } = await supabase
            .from("tasks")
            .update({
                title,
                description: description || null,
                due_date: dueDate || null,
                updated_at: now,
            })
            .eq("id", taskId); // taskId に変更

        if (error) {
            setErrorMsg("保存に失敗しました。");
        } else {
            // 保存成功後、タスク一覧画面へ戻る
            router.push("/tasks");
        }
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                データを読み込み中...
            </div>
        );

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
                            >
                                変更を保存する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
