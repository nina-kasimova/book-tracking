"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";

const MyListsPage = () => {
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editingListId, setEditingListId] = useState<number | null>(null);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        const fetchLists = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://localhost:8000/lists");
                setLists(response.data);
            } catch (error) {
                console.error("Error fetching lists:", error);
                setError("Failed to load lists");
            } finally {
                setLoading(false);
            }
        };
        fetchLists();
    }, []);

    const deleteList = async (listId: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this list?");
        if (!confirmDelete) return;

        try {
            await axios.post("http://localhost:8000/delete_list", { list_id: listId });
            setLists(lists.filter((list: any) => list.id !== listId));
        } catch (error) {
            console.error("Error deleting list:", error);
            alert("Failed to delete list.");
        }
    };

    const editList = async (listId: number) => {
        if (!newName.trim()) return;
        try {
            await axios.post("http://localhost:8000/edit_list_name", {
                list_id: listId,
                new_name: newName,
            });
            setLists(lists.map((list: any) => (list.id === listId ? { ...list, name: newName } : list)));
            setEditingListId(null);
            setNewName("");
        } catch (error) {
            console.error("Error updating list:", error);
            alert("Failed to update list name.");
        }
    };

    if (loading) return <Loading />;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Your Lists</h2>

            {lists.length > 0 ? (
                <ul className="space-y-4">
                    {lists.map((list: any) => (
                        <li
                            key={list.id}
                            className="p-4 bg-gray-100  rounded-lg flex justify-between items-center shadow-sm"
                        >
                            <div>
                                {editingListId === list.id ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-48"
                                            autoFocus
                                        />
                                        <Button onClick={() => editList(list.id)} size="sm">
                                            Save
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => setEditingListId(null)}>
                                            Cancel
                                        </Button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-lg font-medium">{list.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {list.book_count} books
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => {
                                        setEditingListId(list.id);
                                        setNewName(list.name);
                                    }}
                                    variant="outline"
                                    size="sm"
                                >
                                    <Pencil size={16} className="mr-1" />
                                    Edit
                                </Button>
                                <Button onClick={() => deleteList(list.id)} variant="destructive" size="sm">
                                    <Trash size={16} className="mr-1" />
                                    Delete
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-500">No lists found.</p>
            )}
        </div>
    );
};

export default MyListsPage;
