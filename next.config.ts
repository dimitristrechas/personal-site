import type { NextConfig } from "next";

const ghostUrl = process.env.GHOST_URL;
const ghostHost = ghostUrl ? new URL(ghostUrl).hostname : null;
const isDevelopment = process.env.NODE_ENV === "development";

const remotePatterns = [
  ...(ghostHost ? [{ protocol: "https" as const, hostname: ghostHost }] : []),
  ...(isDevelopment ? [{ protocol: "http" as const, hostname: "localhost", pathname: "/**" }] : []),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    ...(isDevelopment && { dangerouslyAllowLocalIP: true }),
  },
};

export default nextConfig;
