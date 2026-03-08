import Link from "next/link";

export default function Home() {
    return (
        <div style={{ padding: "40px" }}>
            <h1>タスク管理アプリ</h1>
            <p>個人用タスク管理Webアプリケーション</p>
            <h2>
                日々のタスクを記録し、完了・未完了を管理できるWebアプリです。
            </h2>

            <hr style={{ margin: "20px 0" }} />

            {/* 👇 ここを縦並び（column）に変更し、リンクと説明をセットでまとめました */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "30px",
                }}
            >
                {/* ログインのブロック */}
                <div>
                    <Link
                        href="/login"
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            fontSize: "20px",
                        }}
                    >
                        ログイン画面へ
                    </Link>
                    <h2
                        style={{
                            fontSize: "16px",
                            marginTop: "8px",
                            fontWeight: "normal",
                            color: "#4b5563",
                        }}
                    >
                        登録済みのユーザーはログインしてタスク管理を始めましょう。
                    </h2>
                </div>

                {/* 新規登録のブロック */}
                <div>
                    <Link
                        href="/signup"
                        style={{
                            color: "blue",
                            textDecoration: "underline",
                            fontSize: "20px",
                        }}
                    >
                        新規登録画面へ
                    </Link>
                    <h2
                        style={{
                            fontSize: "16px",
                            marginTop: "8px",
                            fontWeight: "normal",
                            color: "#4b5563",
                        }}
                    >
                        未登録のユーザーは新規登録してからタスク管理を始めましょう。
                    </h2>
                </div>
            </div>
        </div>
    );
}
