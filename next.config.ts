import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/**': ['./lib/generated/prisma/*.so.node'],
  },
};

export default nextConfig;
