import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prefer this app as Turbopack root when other lockfiles exist on the machine
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
