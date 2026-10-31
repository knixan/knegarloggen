import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  transpilePackages: ["@knegarloggen/ui", "@knegarloggen/app"],
  // Väljer märke i packages/app/src/brand.ts (namn, ROT/RUT, logga).
  env: { NEXT_PUBLIC_APP: "giggerloggen" },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io" },
      { protocol: "https", hostname: "*.ufs.sh" },
    ],
  },
};

export default nextConfig;
