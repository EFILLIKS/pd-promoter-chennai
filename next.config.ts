import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: [],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
