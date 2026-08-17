import type { NextConfig } from "next"

type WebpackConfig = {
  resolve: { extensionAlias?: Record<string, string[]> }
}

const config: NextConfig = {
  transpilePackages: ["@brevy/ui"],
  eslint: { ignoreDuringBuilds: true },
  webpack: (config: WebpackConfig) => {
    config.resolve.extensionAlias = { ".js": [".ts", ".tsx", ".js"] }
    return config
  },
}

export default config
