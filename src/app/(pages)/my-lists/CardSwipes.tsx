"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    cover_url: string;
    page_count: number;
}

const MAX_SELECTION = 2;

export default function CardSwipes({ setLikedBooks, onComplete }) {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false);
    const controls = useAnimation();

    const shuffleArray = (array: Book[]) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                "http://localhost:8000/get_books_byList",
                { params: { list_id: 52 } }
            );
            setBooks(shuffleArray(response.data));
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (direction: "left" | "right") => {
        const book = books[currentIndex];

        if (direction === "right") {
            setSelectedBooks((prev) => [...prev, book]);
        }

        await controls.start({
            x: direction === "right" ? 200 : -200,
            opacity: 0,
        });

        if (selectedBooks.length + 1 >= MAX_SELECTION && direction === "right") {
            const promptBooks = [...selectedBooks, book]
                .map((b) => b.title)
                .join(", ");
            setLikedBooks(promptBooks);
            onComplete(promptBooks);
            setRequestSent(true);
            return;
        }

        setCurrentIndex((prev) => prev + 1);
        controls.set({ x: 0, opacity: 1 });
    };

    const currentBook = books[currentIndex];

    return (
        <div className="max-w-md mx-auto flex flex-col items-center space-y-6">
            <button
                onClick={fetchBooks}
                disabled={loading}
                className="rounded-full px-6 py-3 bg-slate-900 text-white font-semibold hover:bg-slate-800 transition"
            >
                {loading ? "Loading suggestions…" : "Browse suggestions"}
            </button>

            {!requestSent && currentBook && (
                <>
                    <motion.div
                        className="w-80 rounded-2xl bg-white shadow-lg p-6 text-center"
                        animate={controls}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        onDragEnd={(_, info) => {
                            if (info.offset.x > 100) handleSwipe("right");
                            if (info.offset.x < -100) handleSwipe("left");
                        }}
                    >
                        {currentBook.cover_url !== "No cover image" ? (
                            <Image
                                src={currentBook.cover_url.replace(/_SY\d+_/, "_SY500_")}
                                alt={currentBook.title}
                                width={160}
                                height={240}
                                className="rounded-lg mx-auto"
                            />
                        ) : (
                            <div className="h-60 w-40 mx-auto rounded-lg bg-slate-200 flex items-center justify-center text-slate-600">
                                No cover
                            </div>
                        )}

                        <h3 className="mt-4 text-lg font-semibold">
                            {currentBook.title}
                        </h3>
                        <p className="text-sm text-slate-600">{currentBook.author}</p>
                        <p className="text-xs text-slate-500 mt-1">{currentBook.genre}</p>
                    </motion.div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleSwipe("left")}
                            className="px-6 py-2 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition"
                        >
                            Skip
                        </button>
                        <button
                            onClick={() => handleSwipe("right")}
                            className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                            👍 Like
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
