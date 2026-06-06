"use client";

export default function Error({ reset }: { reset: () => void }) {
    return (
        <div>
            <h2>エラーが発生しました。</h2>
            <button onClick={() => reset()}>再試行する</button>
        </div>
    );
}
