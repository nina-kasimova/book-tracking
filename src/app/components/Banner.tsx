// Banner.js
import React from 'react';
import Link from "next/link";

const Banner = () => {
    return (
        <div className="bg-primary sticky top-0 z-[20] p-4 mx-auto flex w-full text-lg border-b border-gray-500">
                <div className="w-1/6 flex justify-start">
                    <Link href="/" className="font-semibold text-2xl text-blue-950 text-white">App Name</Link>
                </div>
                <div className="w-1/5 flex justify-around">
                    <Link href="/books-list" className="text-accent-content/60 hover:text-accent-content/100 text-white">My Books</Link>
                    <Link href="/my-lists" className="text-accent-content/60 hover:text-accent-content/100 text-white">My Lists</Link>
                    <Link href="/about" className="text-accent-content/60 hover:text-accent-content/100 text-white">About</Link>
                </div>
        </div>
    );
};

export default Banner;