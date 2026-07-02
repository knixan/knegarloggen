import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ["@knegarloggen/ui"],
};

export default nextConfig;
