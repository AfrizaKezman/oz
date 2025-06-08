/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                pathname: '/api/images/**',
            },
            {
                protocol: 'http',
                hostname: '**',
                pathname: '/api/images/**',
            }
        ],
    },
    // Add base path configuration for API routes
    async rewrites() {
        return {
            beforeFiles: [
                {
                    source: '/api/:path*',
                    destination: '/api/:path*',
                },
            ],
        };
    }
};

export default nextConfig;