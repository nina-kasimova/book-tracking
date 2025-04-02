"use client";

import {useEffect, useState} from "react";
import axios from "axios";
import {motion, useAnimation} from "framer-motion";
import Image from "next/image";

interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    cover_url: string;
}

const MAX_SELECTION = 3;

export default function CardSwipes({setLikedBooks, onComplete}) {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [requestSent, setRequestSent] = useState(false); // Track if request was sent
    const controls = useAnimation();

    const shuffleArray = (array: Book[]) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/get_books_byList", {
                params: {list_id: 48}
            });

            const shuffledBooks = shuffleArray(response.data);
            setBooks(shuffledBooks);
            console.log("Books fetched & shuffled:", shuffledBooks);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (direction: "left" | "right") => {
        const book = books[currentIndex];

        if (direction === "right") {
            setSelectedBooks((prev) => [...prev, book]);
        }

        await controls.start({x: direction === "right" ? 250 : -250, opacity: 0});

        if (selectedBooks.length + 1 >= MAX_SELECTION) {
            sendPrompt();
            return;
        }

        setCurrentIndex((prevIndex) => prevIndex + 1);
        controls.set({x: 0, opacity: 1});
    };

    const sendPrompt = () => {
        const promptBooks = selectedBooks.map((book) => book.title).join(", ");
        setLikedBooks(promptBooks);
        onComplete(promptBooks);
        setRequestSent(true); // Hide UI once request is sent
    };

    const currentBook = books[currentIndex];

    return (
        <div className="max-w-md mx-auto p-6 flex flex-col items-center">
            <button
                className="px-5 py-2 rounded-lg bg-gray-900 text-white font-medium shadow-md hover:bg-gray-800 transition-all"
                onClick={fetchBooks}
                disabled={loading}
            >
                {loading ? "Loading..." : "Show Suggestions"}
            </button>

            {!requestSent && books.length > 0 && (
                <>
                    <motion.div
                        className="relative w-80 h-96 bg-white shadow-xl rounded-2xl p-6 flex flex-col items-center justify-center mt-6"
                        animate={controls}
                        drag="x"
                        dragConstraints={{left: 0, right: 0}}
                        onDragEnd={(_, info) => {
                            if (info.offset.x > 100) handleSwipe("right");
                            else if (info.offset.x < -100) handleSwipe("left");
                        }}
                    >
                        <Image
                            src={currentBook.cover_url.replace(/_SY\d+_/, "_SY500_")}
                            alt={currentBook.title}
                            width={160}
                            height={240}
                            className="rounded-lg shadow-md"
                        />
                        <h3 className="text-lg font-semibold mt-3 text-gray-900">{currentBook.title}</h3>
                        <p className="text-sm text-gray-600">by {currentBook.author}</p>
                        <p className="text-sm text-gray-500 mt-1">
                            <strong>Genre:</strong> {currentBook.genre}
                        </p>
                    </motion.div>

                    <div className="mt-5 flex gap-4">
                        <button
                            onClick={() => handleSwipe("left")}
                            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow hover:bg-gray-300 transition-all"
                        >
                            👎 Pass
                        </button>
                        <button
                            onClick={() => handleSwipe("right")}
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-all"
                        >
                            👍 Like
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
