// Banner.js
import React from 'react';
import Link from "next/link";

const Banner = () => {
    return (
        <div className="bg-gray-400 sticky top-0 z-[20] p-4 mx-auto flex w-full text-lg border-b border-gray-500">
                <div className="w-1/6 flex justify-start">
                    <p className="font-semibold text-2xl text-blue-950">App Name</p>
                </div>
                <div className="w-1/5 flex justify-around text-accent-content/60 hover:text-accent-content/100">
                    <Link href="/books-list">Your books</Link>
                    <Link href="/about">About</Link>
                </div>


        </div>
    );
};

export default Banner;