export default function Home() {
    return (
        <section className="min-h-[70vh] flex items-center justify-center text-center">
            <div className="max-w-2xl space-y-6">
                <h1 className="text-5xl font-bold tracking-tight text-slate-900">
                    Find books you’ll actually love
                </h1>

                <p className="text-lg text-slate-600">
                    ShelfSense uses AI to understand your reading taste and recommend books
                    based on what resonates with you — not just genres or popularity.
                </p>

                <div className="flex justify-center gap-4 pt-4">
                    <a
                        href="/search"
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    >
                        Get recommendations
                    </a>

                    <a
                        href="/about"
                        className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition"
                    >
                        Learn more
                    </a>
                </div>
            </div>
        </section>
    );
}
