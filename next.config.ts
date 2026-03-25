import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/**': ['./lib/generated/prisma/libquery_engine-rhel-openssl-3.0.x.so.node'],
  },
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
