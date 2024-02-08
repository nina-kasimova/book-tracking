"use client";


import {Table} from "@mui/material";
import {useEffect, useState} from "react";
import {supabase} from "@/utils/supabase";


export default function BooksList() {

    const[bookData, setBookData] = useState<any>([]);

    useEffect( () => {
        async function fetchData() {
            const {data, error} = await supabase
                .from('books')
                .select()
            setBookData(data)
        }
        fetchData().then(r => {
            console.log("Data fetched", bookData)
        });

    }, []);

    return (
            <div>
                <p className="font-semibold text-lg text-primary">My books</p>
                <ul>
                    {bookData.map((book,index) => (

                        <li key={book.id}>
                            {book.title}
                        </li>
                        )
                    )}
                </ul>
                <button className="btn btn-primary">Button</button>
            </div>
    )
}