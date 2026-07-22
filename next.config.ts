import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  compress: true,
  typescript: {
    // Pre-existing type errors from the React/Vite codebase — ignored to match prior build behaviour
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['react-quill-new'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Canonical host: permanently (308) redirect the non-www apex domain to www
  // so the site is not served/indexed on both truscomp.com and www.truscomp.com.
  // Fixes the duplicate meta title/description/canonical issues.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'truscomp.com' }],
        destination: 'https://www.truscomp.com/:path*',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
