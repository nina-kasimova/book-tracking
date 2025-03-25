"use client";


import { useEffect, useState } from "react";
import {DataTable} from "@/app/components/DataTable";
import {Book} from "@/app/(pages)/books-list/book-interface";
import {columns} from "@/app/(pages)/books-list/columns";
import axios from 'axios';
import Loading from "@/app/components/Loading";
import {Input} from "@mui/material";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";



export default function BooksList() {

    const [data, setData] = useState<Book[]>([])
    const [url, setUrl] = useState("")
    const [newListName, setNewListName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [lists, setLists] = useState<{ id: number; name: string }[]>([]);
    const [selectedList, setSelectedList] = useState<string>("Select a list");

    useEffect(() => {
        const fetchLists = async () => {
            try {
                const response = await axios.get("http://localhost:8000/lists");
                setLists(response.data);
            } catch (error) {
                console.error("Error fetching lists:", error);
                setError("Failed to load lists");
            }
        };
        fetchLists();
    }, []);

    const handleScrape = async () => {
        if (!url) {
            alert("Please enter a URL!");
            return;
        }
        if (!newListName) {
            alert("Please enter a list name!");
            return;
        }
        setError("")
        setLoading(true);

        let list_id: number | undefined;

        // Create a new list
        try {
            const headers = {
                "Content-Type": "application/json",
            };
            const data = {
                name: newListName,
            }
            const request = await axios.post(
                "http://localhost:8000/add_list",
                data,
                {headers: headers}
            )
            axios.interceptors.request.use((request) => {
                console.log('Starting Request', JSON.stringify(request, null, 2));
                return request;
            });

            if (request.status == 200) {
                list_id = request.data.id;
            } else {
                throw new Error("Failed to start scraping");
            }
        } catch (error: any) {
            console.error("Error creating list:", error);

            // Handle known API errors
            if (error.response) {
                if (error.response.status === 400) {
                    setError("List name already exists. Try a different name.");
                } else if (error.response.status === 422) {
                    setError("Invalid list name. Please enter a valid one.");
                } else {
                    setError("Failed to create list. Please try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
            setLoading(false);
            return;
        }

        if (!list_id) {
            console.warn("Skipping scraping because list creation failed.");
            setLoading(false);
            return;
        }

        // Scrape the books
        try {
            // Send the URL to FastAPI to start scraping
            const headers = {
                'accept': 'application/json',
                'content-type': 'application/x-www-form-urlencoded'
            };
            const data = {
                url: url,
                list_id: list_id
            }
            const response = await axios.post(
                'http://localhost:8000/scrape',
                '',
                {
                    params:data,
                    headers: headers
                }
            );
            axios.interceptors.request.use((request) => {
                console.log('Starting Request', JSON.stringify(request, null, 2));
                return request;
            });

            if (response.status == 200) {

                setTimeout(async () => {
                    await fetchScrapedBooks();
                }, 15000);
            } else{
                throw new Error("Failed to start scraping");
            }

        } catch (error: any) {
            console.error("Error scraping:", error);

            if (error.response) {
                if (error.response.status === 422) {
                    setError("Invalid URL. Please enter a valid Goodreads list URL.");
                } else {
                    setError("Failed to start scraping. Try again.");
                }
            } else {
                setError("Network error. Please check your connection.");
            }
            setLoading(false);
        }
    };

    const fetchScrapedBooks = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8000/books");
            const books = await response.json();
            setData(books);
            console.log("Books fetched:", books);
        } catch (error) {
            console.error("Error fetching books:", error);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const fetchBooks = async (listId: number) => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8000/get_books_byList", {
                params: { list_id: listId }
            });
            setData(response.data);
            console.log("Books fetched:", response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
            setError("Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div >
            <p className="font-semibold text-lg text-primary">My books</p>
            <div className="flex items-center justify-between py-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="btn btn-sm btn-secondary flex items-center">
                            {selectedList}
                            <KeyboardArrowDownOutlinedIcon />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="bg-white shadow-lg border rounded-lg w-48 mt-2"
                    >
                        {lists.length > 0 ? (
                            lists.map((list) => (
                                <DropdownMenuItem
                                    key={list.id}
                                    onClick={() => {
                                        setSelectedList(list.name);
                                        fetchBooks(list.id);
                                    }}
                                    className="p-2 hover:bg-gray-100"
                                >
                                    {list.name}
                                </DropdownMenuItem>
                            ))
                        ) : (
                            <DropdownMenuItem disabled className="p-2">
                                No lists available
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <p> or create a new one </p>
            <input
                type="text"
                placeholder="Name your list..."
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="border p-2 mr-2"
            />
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
                disabled={!newListName || !url || loading}
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
