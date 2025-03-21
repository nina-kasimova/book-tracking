import {ColumnDef} from '@tanstack/react-table'
import {Book} from "@/app/(pages)/books-list/book-interface";
import { ArrowUpDown, MoreHorizontal } from "lucide-react"


export const columns: ColumnDef<Book>[] = [
    {
        accessorKey: "index",
        header: "#",
        cell: (props) => <p>{props.row.index + 1}</p>, // 1-based index
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
            return (
                <a href={book.url}
                target={"_blank"}
                rel={"noreferrer"}
                className={"flex items-center"}>
                    <p>{props.getValue()}</p>
            </a>
                )}
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