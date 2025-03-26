"use client";

import axios from 'axios';
import {useEffect, useState} from "react";
import {BookRecommendation} from "@/app/constants";
import {handleApiError} from "@/app/utils/apiHelper";


export default function Search() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [likedBooks, setLikedBooks] = useState("")
    const [recommendations, setRecommendations] = useState<BookRecommendation[]>();

    const prompt_template = `I want you to generate book recommendations in JSON format given that i liked the following books before: ${likedBooks}. " +
    "The recommendations should include books with similar themes, writing styles, or emotional depth. Ensure the response follows this exact JSON structure:" +
    "[ {title: 'Book Title', author: 'Book Author', genre: 'Book Genre', description: 'Book Description', reason: 'Reason why you'll like it', goodreads: 'Goodreads Link'}, ... ]`;
    const [prompt, setPrompt] = useState("");

    useEffect(() => {
        setPrompt(prompt_template)
        }, [likedBooks]);

    const sendRequest = async () => {

        setLoading(true);
        setError("");
        setRecommendations([]);

        try {
            const headers = {
                'accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            };
            const data = {
                prompt: prompt,
            }

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
                    setRecommendations(parsedData);

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
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Book Recommendation Search</h1>
            <input
                type="text"
                placeholder="Enter books you like..."
                value={likedBooks}
                onChange={(e) => setLikedBooks(e.target.value)}
                className="w-full border p-2 rounded-md"
            />
            <button
                onClick={sendRequest}
                className={`mt-2 px-4 py-2 text-white rounded ${
                    !likedBooks || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
                }`}
                disabled={!likedBooks || loading}
            >
                {loading ? "Loading..." : "Get Recommendations"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            {recommendations && recommendations.length > 0 && (
                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Recommended Books:</h2>
                    <ul className="mt-2 space-y-4">
                        {recommendations.map((book, index) => (
                            <li key={index} className="p-4 border rounded-md shadow-sm bg-white">
                                <h3 className="text-lg font-bold">{book.title}</h3>
                                <p className="text-sm text-gray-700">by <span className="font-medium">{book.author}</span></p>
                                <p className="text-sm text-gray-600 mt-1"><strong>Genre:</strong> {book.genre}</p>

                                <div className="mt-2">
                                    <p className="text-sm text-gray-800"><strong>Description:</strong></p>
                                    <p className="text-sm text-gray-700">{book.description}</p>
                                </div>

                                <div className="mt-2">
                                    <p className="text-sm text-gray-800"><strong>Why you'll like it:</strong></p>
                                    <p className="text-sm text-gray-700">{book.reason}</p>
                                </div>

                                <a
                                    href={book.goodreads}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 font-semibold hover:underline mt-2 inline-block"
                                >
                                    View on Goodreads
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

        </div>
    );
}