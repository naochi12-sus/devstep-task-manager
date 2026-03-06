import Link from "next/link";

export default function Home() {
    return (
        <div style={{ padding: "40px" }}>
            <h1>タスク管理アプリ</h1>
            <p>Week1の課題：ユーザー認証の実装</p>
            <hr />
            <div style={{ display: "flex", gap: "20px" }}>
                <Link
                    href="/login"
                    style={{ color: "blue", textDecoration: "underline" }}
                >
                    ログイン画面へ
                </Link>
                <Link
                    href="/signup"
                    style={{ color: "blue", textDecoration: "underline" }}
                >
                    新規登録画面へ
                </Link>
            </div>
        </div>
    );
}
