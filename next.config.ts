import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 部署配置
  output: 'export',
  trailingSlash: true,
  // 注意：output: 'export' 模式下，distDir 同时是构建工作目录和静态导出目录，
  // 部署流程依赖产物落在 out/，不要改成其他路径。
  distDir: 'out',

  // 图片优化配置
  images: {
    unoptimized: true,
  },

  // 环境变量配置
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },

  // 安全头配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
};

export default nextConfig;
