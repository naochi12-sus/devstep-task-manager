"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import {
    LogOut,
    CheckCircle2,
    Circle,
    ClipboardList,
    Trash2,
    Pencil,
} from "lucide-react";

interface Task {
    id: string;
    title: string;
    is_completed: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTaskTitle, setNewTaskTitle] = useState("");
    // 新しく追加した記憶スペース
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

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

    // --- 【作成】新しいタスクを追加する ---
    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        const {
            data: { session },
        } = await supabase.auth.getSession();
        const { data, error } = await supabase
            .from("tasks")
            .insert([
                {
                    title: newTaskTitle,
                    user_id: session?.user.id,
                    is_completed: false,
                },
            ])
            .select();

        if (!error && data) {
            setTasks([data[0], ...tasks]);
            setNewTaskTitle("");
        }
    };

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
    // 新しく追加した命令（編集した文字を保存する）
    const saveEdit = async (id: string) => {
        if (!editTitle.trim()) return;

        const { error } = await supabase
            .from("tasks")
            .update({ title: editTitle })
            .eq("id", id);

        if (!error) {
            setTasks(
                tasks.map((t) =>
                    t.id === id ? { ...t, title: editTitle } : t,
                ),
            );
            setEditingId(null); // 編集モードを終わらせる
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
                        className="flex items-center gap-2 text-slate-500 hover:text-red-600"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>ログアウト</span>
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8 text-slate-800">
                    <h2 className="text-2xl font-bold">日報・タスク一覧</h2>
                    <p className="text-sm text-slate-500">
                        進捗を記録しましょう
                    </p>
                </div>

                {/* 入力フォーム */}
                <form onSubmit={addTask} className="mb-8 flex gap-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="新しいタスクを入力..."
                        className="flex-1 p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        type="submit"
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700"
                    >
                        追加
                    </button>
                </form>

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                    {tasks.length > 0 ? (
                        <ul className="divide-y divide-slate-100">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 group min-h-18"
                                >
                                    {/* ★ここが編集モードと通常モードの切り替えになっています */}
                                    {editingId === task.id ? (
                                        // 【編集モードの時】入力欄と保存ボタンが出る
                                        <div className="flex items-center gap-2 w-full">
                                            <input
                                                type="text"
                                                value={editTitle}
                                                onChange={(e) =>
                                                    setEditTitle(e.target.value)
                                                }
                                                className="flex-1 p-2 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() =>
                                                    saveEdit(task.id)
                                                }
                                                className="px-3 py-1.5 bg-indigo-500 text-white text-sm font-medium rounded hover:bg-indigo-600 transition-colors"
                                            >
                                                保存
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setEditingId(null)
                                                }
                                                className="px-3 py-1.5 bg-slate-200 text-slate-600 text-sm font-medium rounded hover:bg-slate-300 transition-colors"
                                            >
                                                キャンセル
                                            </button>
                                        </div>
                                    ) : (
                                        // 【通常モードの時】テキストと各種ボタンが出る
                                        <>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() =>
                                                        toggleTask(
                                                            task.id,
                                                            task.is_completed,
                                                        )
                                                    }
                                                >
                                                    {task.is_completed ? (
                                                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                                    ) : (
                                                        <Circle className="w-6 h-6 text-slate-400" />
                                                    )}
                                                </button>
                                                <span
                                                    className={`text-base font-medium ${task.is_completed ? "text-slate-400 line-through" : "text-slate-700"}`}
                                                >
                                                    {task.title}
                                                </span>
                                            </div>

                                            {/* 右側のボタン群（ペンマークとゴミ箱） */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(task.id);
                                                        setEditTitle(
                                                            task.title,
                                                        );
                                                    }}
                                                    className="p-2 text-slate-300 hover:text-indigo-500 transition-colors rounded-lg hover:bg-indigo-50"
                                                    title="編集する"
                                                >
                                                    <Pencil className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        deleteTask(task.id)
                                                    }
                                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                                    title="削除する"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </>
                                    )}
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
