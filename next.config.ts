import type { NextConfig } from "next";

const ghostUrl = process.env.GHOST_URL;
const ghostHost = ghostUrl ? new URL(ghostUrl).hostname : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: ghostHost
      ? [
          {
            protocol: "https",
            hostname: ghostHost,
          },
        ]
      : [],
  },
};

export default nextConfig;
