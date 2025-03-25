"use client";


import { useEffect, useState } from "react";
import axios from 'axios';
import Loading from "@/app/components/Loading";

const MyListsPage = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLists = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8000/lists");
                setLists(response.data);
            } catch (error) {
                console.error("Error fetching lists:", error);
                setLoading(false);
                setError("Failed to load lists");
            }
        };
        fetchLists().then(r => setLoading(false));
    }, []);

    if (loading) {
        return <Loading/>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <h2 className="text-lg font-semibold">Your Lists</h2>
            {lists ? (
                <ul>
                    {lists.map((list: any) => (
                        <li key={list.id} className="p-2 border-b">
                            {list.name}
                        </li>
                    ))}
                </ul>
            ) :
                (
                    <p>No lists found</p>
                )}

        </div>
    );
};

export default MyListsPage;