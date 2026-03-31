import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    outputFileTracingIncludes: {
"/api/**/*": [path.join(process.cwd(), "lib/generated/prisma/**/*")],
    "/*": [path.join(process.cwd(), "lib/generated/prisma/**/*")],
  },
};

export default nextConfig;