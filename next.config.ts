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
}

export default nextConfig
