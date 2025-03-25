/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "i.gr-assets.com",
            },
        ],
    },
};
module.exports = nextConfig




