"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ 追加：画面遷移のため
import { createClient } from "@/lib/supabase";

// タスクの型
interface Task {
    id: string;
    title: string;
    is_completed: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true); // ✅ 追加：チェック中の表示管理
    const router = useRouter(); // ✅ 追加
    const supabase = createClient();

    useEffect(() => {
        const fetchTasks = async () => {
            // 1. まずログインしているかチェック
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                // ログインしていなければ、ログイン画面へ飛ばす
                router.push("/login");
                return;
            }

            // 2. ログインしていればタスクを取得
            const { data, error } = await supabase.from("tasks").select("*");

            if (error) {
                console.error("データ取得エラー:", error.message);
            } else {
                setTasks(data || []);
            }

            // チェックと読み込みが完了
            setLoading(false);
        };

        fetchTasks();
    }, [router, supabase]);

    // ✅ ログアウト機能を追加
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // ログアウト後にログイン画面へ
    };

    // チェック中は何も表示しない、または読み込み中と出す
    if (loading) {
        return <div style={{ padding: "40px" }}>読み込み中...</div>;
    }

    return (
        <div style={{ padding: "40px" }}>
            {/* ヘッダー部分にログアウトボタンを設置 */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <h1>タスク一覧</h1>
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    ログアウト
                </button>
            </div>

            <p>ここにあなたのタスクが表示されます。</p>
            <hr />

            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.is_completed ? "✅" : "⬜️"} {task.title}
                    </li>
                ))}
            </ul>

            {tasks.length === 0 && (
                <p>まだタスクがありません。タスクを作成してください。</p>
            )}
        </div>
    );
}
