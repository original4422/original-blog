import type { NextConfig } from 'next';

function normalizeBasePath(value: string) {
  if (!value || value === '/') return '';
  return `/${value}`.replace(/\/{2,}/g, '/').replace(/\/$/, '');
}

const basePath = normalizeBasePath(
  process.env.NEXT_PUBLIC_BASE_PATH ?? '/original-blog-pages',
);

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true,
  },
  pageExtensions: ['ts', 'tsx'],
  transpilePackages: ['@original/content'],
};

export default nextConfig;
