import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Banner from "@/app/components/Banner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ShelfSense",
    description: "AI-powered book recommendations based on your taste",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <Banner />
        <main className="max-w-6xl mx-auto px-6 py-12">
            {children}
        </main>
        </body>
        </html>
    );
}
