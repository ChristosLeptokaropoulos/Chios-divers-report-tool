import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/generate-report": ["./templates/**/*"],
  },
};

export default nextConfig;
