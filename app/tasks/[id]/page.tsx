"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Link from "next/link";
import {
    ArrowLeft,
    Pencil,
    Trash2,
    CheckCircle2,
    Circle,
    Clock,
    Calendar,
    RefreshCw,
    FileText,
} from "lucide-react";

interface Task {
    id: string;
    title: string;
    description?: string;
    is_completed: boolean;
    due_date?: string;
    created_at: string;
    updated_at?: string;
}

export default function TaskDetailPage() {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false); // ★削除中のフラグ
    const [isToggling, setIsToggling] = useState(false); // ★更新中のフラグ
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();
    const supabase = createClient();

    // URLからIDを取得
    const params = useParams();
    const taskId = params.id as string;

    useEffect(() => {
        if (!taskId) return;

        const fetchTask = async () => {
            try {
                const { data, error } = await supabase
                    .from("tasks")
                    .select("*")
                    .eq("id", taskId)
                    .single();

                if (error) throw error;
                setTask(data);
            } catch (err) {
                console.error(err); // 警告対策：エラー内容をログに出す
                setErrorMsg("データの読み込みに失敗しました。");
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, [taskId, supabase]);

    // 削除機能：try...catch で安全に
    const handleDelete = async () => {
        if (!window.confirm("本当にこのタスクを削除しますか？")) return;

        setIsDeleting(true);
        try {
            const { error } = await supabase
                .from("tasks")
                .delete()
                .eq("id", taskId);
            if (error) throw error;
            router.push("/tasks");
        } catch (err) {
            console.error(err); // 警告対策：エラー内容をログに出す
            setErrorMsg("データの読み込みに失敗しました。");
        } finally {
            setIsDeleting(false);
        }
    };

    // ステータス切り替え：連打防止
    const toggleTask = async () => {
        if (!task || isToggling) return;

        setIsToggling(true);
        try {
            const now = new Date().toISOString();
            const { error } = await supabase
                .from("tasks")
                .update({ is_completed: !task.is_completed, updated_at: now })
                .eq("id", taskId);

            if (error) throw error;

            setTask({
                ...task,
                is_completed: !task.is_completed,
                updated_at: now,
            });
        } catch (err) {
            console.error(err); // 警告対策
            setErrorMsg("ステータスの更新に失敗しました。");
        } finally {
            setIsToggling(false);
        }
    };

    // (formatDate関数はそのまま)
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center">
                読み込み中...
            </div>
        );

    if (errorMsg || !task) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">
                    {errorMsg || "タスクが見つかりませんでした"}
                </p>
                <Link href="/tasks" className="text-indigo-600 hover:underline">
                    一覧へ戻る
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                {/* 戻るボタン */}
                <div className="flex justify-between items-center mb-6">
                    <Link
                        href="/tasks"
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600"
                    >
                        <ArrowLeft className="w-4 h-4" /> 一覧へ戻る
                    </Link>

                    {/* 編集・削除ボタン（PencilとTrash2を使用！） */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={`/tasks/${taskId}/edit`}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:text-indigo-600"
                            style={{ cursor: "pointer" }} // 強制的に指マークにする
                        >
                            <Pencil className="w-4 h-4" /> 編集
                        </Link>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-500 rounded-lg shadow-sm hover:bg-red-50 cursor-pointer"
                            style={{ cursor: "pointer" }} // 強制的に指マークにする
                        >
                            <Trash2 className="w-4 h-4" /> 削除
                        </button>
                    </div>
                </div>

                {/* タスク詳細カード */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex items-start gap-4 mb-8">
                        <button
                            onClick={toggleTask}
                            className="mt-1 shrink-0 cursor-pointer"
                            style={{ cursor: "pointer" }} // 強制的に指マーク
                        >
                            {task.is_completed ? (
                                /* 完了時：ホバーで少し色を濃く（または薄く）する設定 */
                                <CheckCircle2 className="w-8 h-8 text-emerald-500 hover:text-emerald-600 transition-colors" />
                            ) : (
                                /* 未完了時：既存の設定 */
                                <Circle className="w-8 h-8 text-slate-300 hover:text-indigo-400 transition-colors" />
                            )}
                        </button>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1
                                    className={`text-2xl font-bold ${task.is_completed ? "text-slate-400 line-through" : "text-slate-800"}`}
                                >
                                    {task.title}
                                </h1>
                                {task.is_completed ? (
                                    <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
                                        完了
                                    </span>
                                ) : (
                                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                                        未完了
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 border-b border-slate-100 pb-4">
                                <span className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4" />
                                    作成: {formatDate(task.created_at)}
                                </span>
                                {task.updated_at && (
                                    <span className="flex items-center gap-1.5">
                                        <RefreshCw className="w-4 h-4" />
                                        更新: {formatDate(task.updated_at)}
                                    </span>
                                )}
                                {task.due_date && (
                                    <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-medium">
                                        <Calendar className="w-4 h-4" />
                                        期限: {task.due_date}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* タスク詳細テキストエリア */}
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 min-h-37.5">
                        <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold">
                            <FileText className="w-5 h-5 text-indigo-500" />
                            詳細内容
                        </div>
                        {task.description ? (
                            <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                                {task.description}
                            </p>
                        ) : (
                            <p className="text-slate-400 italic">
                                詳細は入力されていません。
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
