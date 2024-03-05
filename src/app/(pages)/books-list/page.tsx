"use client";


import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import {
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table'

type Book = {
    title: string
    author: string
    my_rating: number
    avg_rating: number
    num_pages: number
    org_year_publish: number
    date_read: number
    status: string
}

export default function BooksList() {

    const [data, setData] = useState<Book[]>([])
    const [bookData, setBookData] = useState<Book[]>([])

    const columns = [
        {
            accessorKey: 'title',
            header: 'Title',
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: 'author',
            header: 'Author',
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: 'my_rating',
            header: 'My Rating',
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: 'date_read',
            header: 'Date Read',
            cell: (props) => <p>{props.getValue()}</p>
        }
    ]
    const table = useReactTable({ columns, data, getCoreRowModel: getCoreRowModel() })

    useEffect(() => {
        async function fetchData() {
            const { data, error } = await supabase
                .from('goodreads_library')
                .select()
            setData(data)
        }

        fetchData().then(r => {
            console.log("Data fetched", bookData)
        });

    }, []);

    return (
        <div>
            <p className="font-semibold text-lg text-primary">My books</p>
            {bookData ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead>
                        <tr className="bg-gray-200">
                            {table.getHeaderGroups().map(headerGroup =>
                                headerGroup.headers.map(header => (
                                    <th key={header.id} className="px-4 py-2">
                                        {header.column.columnDef.header}
                                    </th>
                                ))
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {table.getRowModel().rows.map(row => (
                            <tr key={row.id} className="hover:bg-gray-100">
                                {row.getVisibleCells().map(cell => (
                                    <td key={cell.id} className="border px-4 py-2">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Books not loaded</p>
            )}
            <button className="btn btn-primary">Button</button>
        </div>
    )
}
