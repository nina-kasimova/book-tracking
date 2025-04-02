"use client";

import axios from 'axios';
import {useEffect, useState} from "react";
import {BookRecommendation} from "@/app/utils/constants";
import {handleApiError} from "@/app/utils/apiHelper";
import {prompt_template} from "@/app/utils/constants";
import CardSwipes from "@/app/(pages)/my-lists/CardSwipes";

export default function Search() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [likedBooks, setLikedBooks] = useState("")
    const [recommendations, setRecommendations] = useState<BookRecommendation[]>([]);
    const [prompt, setPrompt] = useState("");
    const [moodAnalysis, setMoodAnalysis] = useState("");

    useEffect(() => {
        setPrompt(prompt_template(likedBooks));
    }, [likedBooks]);

    const sendRequest = async (likedBooksFromSwipe?: string) => {
        const booksToUse = likedBooksFromSwipe || likedBooks;

        if (!booksToUse) return;

        setLoading(true);
        setError("");
        setRecommendations([]);

        try {
            const headers = {
                'accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            };
            const data = {
                prompt: prompt_template(booksToUse),
            };

            const response = await axios.post(
                "http://localhost:8000/get_recommendations",
                '',
                {
                    params: data,
                    headers: headers
                }
            )

            axios.interceptors.request.use((request) => {
                console.log('Starting Request', JSON.stringify(request, null, 2));
                return request;
            });

            if (response.status == 200) {
                let content = response.data?.choices[0]?.message?.content || "";

                // Trim whitespace
                content = content.trim();

                if (content.startsWith("```json")) {
                    content = content.slice(7, -3).trim();
                } else if (content.startsWith("```")) {
                    content = content.slice(3, -3).trim();
                }

                // Step 2: Attempt to parse JSON safely
                let parsedData: BookRecommendation[];
                try {
                    parsedData = JSON.parse(content);
                    setRecommendations(parsedData.recommendations);
                    setMoodAnalysis(parsedData.mood_analysis);

                } catch (error) {
                    throw new Error("Failed to parse JSON. Check the LLM response format.");
                }
            } else {
                throw new Error("Failed to start scraping");
            }
        } catch (error: any) {
            handleApiError(error, setError);
            setLoading(false);
            return;
        } finally {
            setLoading(false);
        }
    }
    return (
        <div className="max-w-3xl mx-auto p-6 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Book Recommendation Search</h1>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Enter books you like..."
                    value={likedBooks}
                    onChange={(e) => setLikedBooks(e.target.value)}
                    className="flex-grow border border-gray-300 p-3 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={() => sendRequest(likedBooks)}
                    className={`px-5 py-3 rounded-lg text-white font-semibold shadow-md transition-all ${!likedBooks || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
                    disabled={!likedBooks || loading}
                >
                    {loading ? "Loading..." : "Get Recommendations"}
                </button>
            </div>

            <CardSwipes setLikedBooks={setLikedBooks} onComplete={(promptBooks:string) => sendRequest(promptBooks)} />
            {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

            {recommendations.length > 0 && (
                <div className="mt-6">
                    {moodAnalysis && (
                        <div className="bg-white p-4 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-900">Mood Analysis:</h2>
                            <p className="text-gray-700 mt-1">{moodAnalysis}</p>
                        </div>
                    )}
                    <h2 className="text-xl font-semibold text-gray-900 mt-6">Recommended Books:</h2>
                    <div className="grid gap-6 mt-4">
                        {recommendations.map((book, index) => (
                            <div key={index} className="bg-white p-5 rounded-lg shadow-md border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900">{book.title}</h3>
                                <p className="text-gray-700 text-sm">by <span className="font-medium">{book.author}</span></p>
                                <p className="text-sm text-gray-600 mt-1"><strong>Genre:</strong> {book.genre}</p>
                                <p className="text-sm text-gray-700 mt-2"><strong>Description:</strong> {book.description}</p>
                                <p className="text-sm text-gray-700 mt-2"><strong>Why you'll like it:</strong> {book.reason}</p>
                                {book.goodreads && (
                                    <a
                                        href={book.goodreads}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 font-semibold hover:underline mt-2 inline-block"
                                    >
                                        View on Goodreads
                                    </a>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}