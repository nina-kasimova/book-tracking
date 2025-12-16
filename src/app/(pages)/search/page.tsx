"use client";

import axios from 'axios';
import {useEffect, useState} from "react";
import {BookRecommendation} from "@/app/utils/constants";
import {handleApiError} from "@/app/utils/apiHelper";
import {prompt_template} from "@/app/utils/constants";
import CardSwipes from "@/app/(pages)/my-lists/CardSwipes";
import { recommendationMock } from "@/app/utils/mockData";

const USE_MOCK_DATA = true;


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

        if (USE_MOCK_DATA) {
            setMoodAnalysis(recommendationMock.mood_analysis);
            setRecommendations(recommendationMock.recommendations);
            setLoading(false);
            return;
        }

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

                const rawContent = response.data.choices[0].message.content;
                console.log("raw content", rawContent)

                const jsonMatch = rawContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);

                if (!jsonMatch) {
                    throw new Error("No JSON block found in LLM response");
                }

                const jsonString = jsonMatch[1];
                const parsedData = JSON.parse(jsonString);

                console.log("parsed data", parsedData)

                setRecommendations(parsedData.recommendations);
                setMoodAnalysis(parsedData.mood_analysis);

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
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-16">
            <div className="max-w-4xl mx-auto space-y-12">

                {/* HERO */}
                <section className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-slate-900">
                        Taste-Based Book Recommendations
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Tell us a few books you enjoyed. We’ll analyze your reading taste and suggest
                        new books you’re likely to love.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                        <input
                            type="text"
                            placeholder="e.g. The Bell Jar, I, Robot, Notes from Underground"
                            value={likedBooks}
                            onChange={(e) => setLikedBooks(e.target.value)}
                            className="flex-1 max-w-xl rounded-xl border border-slate-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={() => sendRequest(likedBooks)}
                            disabled={!likedBooks || loading}
                            className={`rounded-xl px-6 py-3 font-semibold text-white transition ${
                                loading
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {loading ? "Analyzing…" : "Get recommendations"}
                        </button>
                    </div>
                </section>

                {/* SWIPE SUGGESTIONS */}
                <section className="pt-6">
                    <CardSwipes
                        setLikedBooks={setLikedBooks}
                        onComplete={(promptBooks: string) => sendRequest(promptBooks)}
                    />
                </section>

                {error && (
                    <p className="text-center text-red-500 font-medium">{error}</p>
                )}

                {/* AI INSIGHT */}
                {moodAnalysis && (
                    <section className="bg-white rounded-2xl shadow-md p-6 border-l-4 border-blue-500">
                        <p className="uppercase text-xs tracking-widest text-blue-600 font-semibold">
                            AI Insight
                        </p>
                        <p className="mt-2 text-slate-700 leading-relaxed">
                            {moodAnalysis}
                        </p>
                    </section>
                )}

                {/* RECOMMENDATIONS */}
                {recommendations.length > 0 && (
                    <section className="space-y-6">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Recommended for you
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {recommendations.map((book, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
                                >
                                    <h3 className="text-lg font-bold text-slate-900">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-slate-600 mb-2">
                                        by <span className="font-medium">{book.author}</span>
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        <strong>Genre:</strong> {book.genre}
                                    </p>

                                    <p className="text-sm text-slate-700 mt-3">
                                        {book.description}
                                    </p>

                                    <p className="text-sm text-slate-700 mt-3">
                                        <strong>Why you’ll like it:</strong> {book.reason}
                                    </p>

                                    {book.goodreads && (
                                        <a
                                            href={book.goodreads}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block mt-4 text-blue-600 font-semibold hover:underline"
                                        >
                                            View on Goodreads →
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}