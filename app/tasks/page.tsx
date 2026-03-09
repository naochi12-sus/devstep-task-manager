"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { LogOut, CheckCircle2, Circle, ClipboardList } from "lucide-react";

interface Task {
    id: string;
    title: string;
    is_completed: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        const fetchTasks = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            const { data, error } = await supabase.from("tasks").select("*");

            if (error) {
                console.error("データ取得エラー:", error.message);
            } else {
                setTasks(data || []);
            }

            setLoading(false);
        };

        fetchTasks();
    }, [router, supabase]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">
                        データを読み込んでいます...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* ヘッダー（ナビゲーションバー） */}
            <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* 左側：ロゴとアプリ名 */}
                    <div className="flex items-center gap-3">
                        <Image
                            src="/Logo1.png"
                            alt="Our Goal ロゴ"
                            width={36}
                            height={36}
                            className="rounded-full shadow-sm"
                        />
                        <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 tracking-tight">
                            Our Goal
                        </h1>
                    </div>

                    {/* 右側：ログアウトボタン */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">ログアウト</span>
                    </button>
                </div>
            </header>

            {/* メインコンテンツ（タスク一覧エリア） */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">
                            日報・タスク一覧
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            チームの進捗を確認しましょう
                        </p>
                    </div>
                </div>

                {/* タスクのリスト（カード型デザイン） */}
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {tasks.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors group"
                                >
                                    {/* 完了状態によってアイコンと色を変える */}
                                    <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                                        {task.is_completed ? (
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-6 h-6" />
                                        )}
                                    </button>

                                    <span
                                        className={`text-base font-medium ${task.is_completed ? "text-slate-400 line-through" : "text-slate-700"}`}
                                    >
                                        {task.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        // タスクが0件の時の美しい空っぽ状態（Empty State）
                        <div className="p-12 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                <ClipboardList className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mb-1">
                                まだ日報がありません
                            </h3>
                            <p className="text-slate-500">
                                新しいタスクを追加して、進捗を記録しましょう。
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
