import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubPages ? "/swap_usdt" : undefined,
  assetPrefix: isGithubPages ? "/swap_usdt/" : undefined,
  trailingSlash: true,
};

export default nextConfig;
