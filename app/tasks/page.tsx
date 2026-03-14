"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import {
    LogOut,
    ClipboardList,
    Plus,
    CheckCircle2,
    Circle,
    Clock,
    Calendar,
    Eye,
    Pencil,
    Trash2,
    RefreshCw,
} from "lucide-react";

interface Task {
    id: string;
    title: string;
    is_completed: boolean;
    due_date?: string;
    created_at: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    // --- 【読み込み】画面を開いたときにデータを取る ---
    useEffect(() => {
        const fetchTasks = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            if (!error) setTasks(data || []);
            setLoading(false);
        };
        fetchTasks();
    }, [router, supabase]);

    // --- 【更新】完了・未完了を切り替える ---
    const toggleTask = async (id: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from("tasks")
            .update({ is_completed: !currentStatus })
            .eq("id", id);

        if (!error) {
            setTasks(
                tasks.map((t) =>
                    t.id === id ? { ...t, is_completed: !currentStatus } : t,
                ),
            );
        }
    };

    // --- 【削除】タスクを消去する ---
    const deleteTask = async (id: string) => {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (!error) {
            setTasks(tasks.filter((t) => t.id !== id));
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    // 日付を日本時間で綺麗に表示するための関数
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ロゴ付きヘッダー */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/Logo1.png"
                            alt="Logo"
                            width={36}
                            height={36}
                            className="rounded-full"
                        />
                        <h1 className="text-xl font-extrabold text-indigo-600">
                            Our Goal
                        </h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>ログアウト</span>
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* タイトルと新規作成ボタンを横並びに配置 */}
                <div className="mb-8 flex justify-between items-end">
                    <div className="text-slate-800">
                        <h2 className="text-2xl font-bold">タスク一覧</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            タスクを追加して、進捗を記録しましょう
                        </p>
                    </div>
                    <Link
                        href="/tasks/new"
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-bold shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        新規タスク作成
                    </Link>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {tasks.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 group min-h-18 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-start gap-4 flex-1">
                                            <button
                                                onClick={() =>
                                                    toggleTask(
                                                        task.id,
                                                        task.is_completed,
                                                    )
                                                }
                                                className="shrink-0 focus:outline-none"
                                            >
                                                {task.is_completed ? (
                                                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                ) : (
                                                    <Circle className="w-6 h-6 text-slate-400" />
                                                )}
                                            </button>

                                            <div className="flex flex-col gap-2">
                                                {/* タイトルとステータス表示 */}
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span
                                                        className={`text-lg font-bold ${task.is_completed ? "text-slate-400 line-through" : "text-slate-800"}`}
                                                    >
                                                        {task.title}
                                                    </span>
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

                                                {/* 作成日時と期限日 */}
                                                <div className="flex flex-wrap items-center gap-4 text-sm mt-1">
                                                    <span className="flex items-center gap-1.5 text-slate-500">
                                                        <Clock className="w-4 h-4" />
                                                        作成:{" "}
                                                        {formatDate(
                                                            task.created_at,
                                                        )}
                                                    </span>
                                                    {task.due_date && (
                                                        <span className="flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-medium">
                                                            <Calendar className="w-4 h-4" />
                                                            期限:{" "}
                                                            {task.due_date}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 目玉マークとペンマークとゴミ箱マーク */}
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/tasks/${task.id}`}
                                            className="inline-flex items-center p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                            title="詳細を見る"
                                        >
                                            <Eye className="w-6 h-6" />
                                        </Link>

                                        <Link
                                            href={`/tasks/${task.id}/edit`}
                                            className="p-2 text-slate-300 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50"
                                            title="編集する"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </Link>

                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                            title="削除する"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // 美しい空っぽ状態
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <ClipboardList className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">
                                まだタスクがありません
                            </h3>
                            <p className="text-slate-500">
                                右上の「新規作成」からタスクを追加して、進捗を記録しましょう。
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
