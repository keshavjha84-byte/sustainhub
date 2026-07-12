import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-57fafabd-a8f2-4cbf-a456-ead9c25d51f4.space-z.ai",
  ],
};

export default nextConfig;