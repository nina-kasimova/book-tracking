import {ColumnDef} from '@tanstack/react-table'
import {Book} from "@/app/(pages)/books-list/book-interface";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import Image from "next/image";


// @ts-ignore
export const columns: ColumnDef<Book>[] = [
    {
        accessorKey: "index",
        header: "#",
        cell: (props) => <p>{props.row.index + 1}</p>, // 1-based index
    },
    {
        accessorKey: 'cover_url',
        header: () => <></>,
        cell: (props) => {
            const book = props.row.original;

            if (!book.cover_url) return null;

            // Replace "_SY75_" with "_SY500_" for better resolution
            const highResCover = book.cover_url.replace(/_SY\d+_/, "_SY500_");

            return (
                <Image
                    src={highResCover}
                    alt="Book Cover"
                    width={70}  // Adjust based on your design
                    height={120} // Adjust based on your design
                    className="object-cover rounded-md shadow-md"
                />
            );
        }
    },
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <button
                    className="btn btn-ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: (props) => {
            const book = props.row.original
            return book.url ? (
                <a
                    href={"https://www.goodreads.com" + book.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center"
                >
                    <p>{props.getValue()}</p>
                </a>
            ) : (
                <p>{props.getValue()}</p>
            );
        }
        },
    {
        accessorKey: 'author',
        header: ({ column }) => {
            return (
                <button
                    className="btn btn-ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Author
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        accessorKey: 'avg_rating',
        header: ({ column }) => {
            return (
                <button
                    className="btn btn-ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Avg Rating
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        accessorKey: 'review_count',
        header: ({ column }) => {
            return (
                <button
                    className="btn btn-ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Reviews
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: (props) => <p>{props.getValue()}</p>
    },
    {
        accessorKey: 'date_read',
        header: ({ column }) => {
            return (
                <button
                    className="btn btn-ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date Read
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </button>
            )
        },
        cell: (props) => <p>{props.getValue()}</p>
    }
]