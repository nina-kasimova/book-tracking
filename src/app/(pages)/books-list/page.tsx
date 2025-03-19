"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {DataTable} from "@/app/components/DataTable";
import {Book} from "@/app/(pages)/books-list/book-interface";
import {columns} from "@/app/(pages)/books-list/columns";
import axios from 'axios';
import Loading from "@/app/(pages)/books-list/loading";



export default function BooksList() {

    const [data, setData] = useState<Book[]>([])
    const [url, setUrl] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")

    const handleScrape = async () => {
        if (!url) {
            alert("Please enter a URL!");
            return;
        }
        setLoading(true);

        try {
            // Send the URL to FastAPI to start scraping
            const headers = {
                "Content-Type": "application/json",
            };
            const data = {
                url: url,
            }
            const request = await axios.post(
                "http://localhost:8000/scrape",
                null,
                {
                    params: data,
                    headers: headers
                })
            axios.interceptors.request.use((request) => {
                console.log('Starting Request', JSON.stringify(request, null, 2));
                return request;
            });
            if (request.status == 200) {
                console.log(request.data);
            } else{
                throw new Error("Failed to start scraping");
            }

            // Wait a few seconds, then fetch books
            setTimeout(fetchBooks, 15000); // Wait 5 seconds before fetching

        } catch (error) {
            console.error("Error scraping:", error);
            setError("Error scraping")
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await fetch("http://localhost:8000/books");
            const books = await response.json();
            setData(books);
            console.log("Books fetched:", books);
        } catch (error) {
            console.error("Error fetching books:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p className="font-semibold text-lg text-primary">My books</p>
            <input
                type="text"
                placeholder="Paste Goodreads list URL here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="border p-2 mr-2"
            />
            <button
                onClick={handleScrape}
                className={`btn btn-sm mr-1 ${
                    !url || loading ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "btn-secondary"
                }`}
                disabled={!url || loading}
            >
                Scrape Books
            </button>
            {/* Error Message */}
            {error && <p className="text-red-500">{error}</p>}

            {/* Show Loading Spinner */}
            {loading && (
                <Loading/>
            )}
            {data ? (
                <div className="overflow-x-auto">
                    <DataTable columns={columns} data={data} />
                </div>
            ) : (
                <p>Books not loaded</p>
            )}
        </div>
    )
}
