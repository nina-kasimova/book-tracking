/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.gr-assets.com",
            },
            {
                protocol: "http",
                hostname: "books.google.com",
            }
        ],
    },
};
module.exports = nextConfig




