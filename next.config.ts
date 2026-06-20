import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: repositoryName ? `/${repositoryName}` : "",
  assetPrefix: repositoryName ? `/${repositoryName}/` : "",
};

export default nextConfig;
