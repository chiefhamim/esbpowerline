import type { NextConfig } from 'next';

// Each dev port runs its own Next instance — separate dist dirs prevent cache corruption
const surface = process.env.APP_SURFACE ?? 'all';
const distDir = surface === 'all' ? '.next' : `.next-${surface}`;

const nextConfig: NextConfig = {
  // Ensure auth secret is available to edge middleware on Vercel
  env: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  distDir,
  // Native SQLite driver — must stay external for Vercel serverless bundles
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3'],

  experimental: {
    // Disabled: parallel split-surface dev (3 instances) can corrupt Turbopack's dev cache
    turbopackFileSystemCacheForDev: false,
    turbopackFileSystemCacheForBuild: true,
    optimizePackageImports: [
      'lucide-react',
      'recharts',
      'date-fns',
      'sonner',
      '@supabase/supabase-js',
      '@supabase/ssr',
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable for future image domains if needed for external article images
  images: {
    unoptimized: true,
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
