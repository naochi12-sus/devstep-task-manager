export default function TestPage() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>Supabase接続テスト</h1>
            <p>設定されたURL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
            {process.env.NEXT_PUBLIC_SUPABASE_URL ? (
                <p style={{ color: "green" }}>✅ 設定を読み込めています！</p>
            ) : (
                <p style={{ color: "red" }}>
                    ❌ 設定が読み込めていません。.env.localを確認してください。
                </p>
            )}
        </div>
    );
}
