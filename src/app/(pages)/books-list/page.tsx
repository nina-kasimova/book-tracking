"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {DataTable} from "@/app/components/DataTable";
import {Book} from "@/app/(pages)/books-list/book-interface";
import {columns} from "@/app/(pages)/books-list/columns";


export default function BooksList() {

    const [data, setData] = useState<Book[]>([])

    // const columns = [
    //     {
    //         accessorKey: 'title',
    //         header: 'Title',
    //         cell: (props) => <p>{props.getValue()}</p>
    //     },
    //     {
    //         accessorKey: 'author',
    //         header: 'Author',
    //         cell: (props) => <p>{props.getValue()}</p>
    //     },
    //     {
    //         accessorKey: 'my_rating',
    //         header: 'My Rating',
    //         cell: (props) => <p>{props.getValue()}</p>
    //     },
    //     {
    //         accessorKey: 'date_read',
    //         header: 'Date Read',
    //         cell: (props) => <p>{props.getValue()}</p>
    //     }
    // ]

    useEffect(() => {
        async function fetchData() {
            const { data, error } = await supabase
                .from('goodreads_library')
                .select()
            setData(data)
        }

        fetchData().then(r => {
            console.log("Data fetched", data)
        });

    }, []);

    return (
        <div>
            <p className="font-semibold text-lg text-primary">My books</p>
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
