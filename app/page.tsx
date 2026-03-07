import Link from "next/link";

export default function Home() {
    return (
        <div style={{ padding: "40px" }}>
            <h1>タスク管理アプリ</h1>
            <p>個人用タスク管理Webアプリケーション</p>
            <h2>
                日々のタスクを記録し、完了・未完了を管理できるWebアプリです。
            </h2>
            <hr />
            <div style={{ display: "flex", gap: "20px" }}>
                <Link
                    href="/login"
                    style={{ color: "blue", textDecoration: "underline" }}
                >
                    ログイン画面へ
                </Link>
                <h2>
                    登録済みのユーザーはログインしてタスク管理を始めましょう。
                </h2>
                <Link
                    href="/signup"
                    style={{ color: "blue", textDecoration: "underline" }}
                >
                    新規登録画面へ
                </Link>
                <h2>
                    未登録のユーザーは新規登録してからタスク管理を始めましょう。
                </h2>
            </div>
        </div>
    );
}
