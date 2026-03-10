/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com', // Permite imagens do Unsplash
            },
            {
                protocol: 'https',
                hostname: 'example.com', // Mantendo aquele nosso primeiro de isopor para não dar erro
            },
        ],
    },
};

export default nextConfig;
