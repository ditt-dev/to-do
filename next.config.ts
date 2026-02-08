import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build the project as a standalone app inside the Docker image.
  output: "standalone",
};

export default nextConfig;
