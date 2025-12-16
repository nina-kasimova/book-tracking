import Link from "next/link";

export default function Banner() {
    return (
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold text-slate-900">
                    ShelfSense
                </Link>

                <nav className="flex gap-6 text-sm font-medium text-slate-600">
                    <Link href="/books-list" className="hover:text-slate-900">
                        My Books
                    </Link>
                    <Link href="/my-lists" className="hover:text-slate-900">
                        My Lists
                    </Link>
                    <Link href="/search" className="hover:text-slate-900">
                        Recommendations
                    </Link>
                    <Link href="/about" className="hover:text-slate-900">
                        About
                    </Link>
                </nav>
            </div>
        </header>
    );
}
