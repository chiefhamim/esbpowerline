import type { NextConfig } from 'next';

// Each dev port runs its own Next instance — separate dist dirs prevent cache corruption
const surface = process.env.APP_SURFACE ?? 'all';
const distDir = surface === 'all' ? '.next' : `.next-${surface}`;

const nextConfig: NextConfig = {
  distDir,
  // Native SQLite driver — must stay external for Vercel serverless bundles
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable for future image domains if needed for external article images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  outputFileTracingIncludes: {
    '/*': ['./dev.db'],
  },
};

export default nextConfig;
