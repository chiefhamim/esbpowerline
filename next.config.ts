import type { NextConfig } from 'next';

// Each dev port runs its own Next instance — separate dist dirs prevent cache corruption
const surface = process.env.APP_SURFACE ?? 'all';
const distDir = surface === 'all' ? '.next' : `.next-${surface}`;

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  distDir,
  env: {
    NEXT_PUBLIC_APP_SURFACE: surface,
  },

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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
