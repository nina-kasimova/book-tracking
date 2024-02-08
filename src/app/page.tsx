"use client";

import Image from 'next/image';
import Link from 'next/link';
import Banner from "@/app/components/Banner";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-6xl font-bold text-teal-900">
                Books app random text
            </div>
        </main>
    );
}
