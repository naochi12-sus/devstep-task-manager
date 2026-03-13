import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden p-4">
            {/* 背景のモダンな光のボカシ効果（SaaSアプリ風） */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-300/40 rounded-full mix-blend-multiply filter blur-3xl"></div>

            {/* メインコンテンツ */}
            <div className="z-10 text-center max-w-3xl px-4">
                {/* 大きめのロゴ表示 */}
                <div className="flex justify-center mb-8">
                    <Image
                        src="/Logo1.png"
                        alt="Our Goal ロゴ"
                        width={96}
                        height={96}
                        className="rounded-full shadow-xl hover:scale-105 transition-transform duration-300"
                    />
                </div>

                {/* アプリ名（グラデーション） */}
                <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-cyan-500">
                        Our Goal
                    </span>
                </h1>

                {/* キャッチコピー */}
                <p className="text-xl md:text-2xl font-bold text-slate-700 mb-6">
                    チームの成長を加速させる日報システム
                </p>

                <p className="text-base md:text-lg text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                    日々の業務や目標の進捗をチーム全員で共有。
                    <br className="hidden md:block" />
                    シンプルな操作で、毎日の振り返りを価値あるものに変えましょう。
                </p>

                {/* アクションボタン（白と黒のコントラストで並べる） */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    {/* ログイン画面（白のカードへ） */}
                    <Link
                        href="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:shadow-lg border border-slate-200 transition-all transform hover:-translate-y-1"
                    >
                        ログインして始める
                    </Link>

                    {/* 新規登録画面（黒のカードへ） */}
                    <Link
                        href="/signup"
                        className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:bg-slate-700 transition-all transform hover:-translate-y-1"
                    >
                        新しくアカウントを作る
                    </Link>
                </div>
            </div>
        </div>
    );
}
