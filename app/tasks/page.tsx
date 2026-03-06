"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";

// タスクの型（どんなデータがあるか）を定義
interface Task {
    id: string;
    title: string;
    is_completed: boolean;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const supabase = createClient();

    // 画面が開いた瞬間にデータを読み込む
    useEffect(() => {
        const fetchTasks = async () => {
            const { data, error } = await supabase
                .from("tasks") // Supabaseのtasksテーブルから
                .select("*"); // すべての列を取得

            if (error) {
                console.error("データ取得エラー:", error.message);
            } else {
                setTasks(data || []);
            }
        };
        fetchTasks();
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h1>タスク一覧</h1>
            <p>ここにあなたのタスクが表示されます。</p>
            <hr />

            {/* タスクの一覧を表示する部分 */}
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
