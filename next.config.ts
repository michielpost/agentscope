import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Stub optional wallet SDK packages that wagmi/RainbowKit probe for at
    // runtime. Without this, browsers throw "Cannot find module" when the
    // injected wallet connector tries to dynamically import them.
    resolveAlias: {
      "@metamask/sdk": "./src/lib/empty-module.ts",
      "@walletconnect/ethereum-provider": "./src/lib/empty-module.ts",
    },
  },
};

export default nextConfig;
