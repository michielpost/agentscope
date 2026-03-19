import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  injectedWallet,
  walletConnectWallet,
  coinbaseWallet,
  rainbowWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { mainnet, base, celo } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo'

// Use injectedWallet instead of metaMaskWallet — injectedWallet detects MetaMask
// (and any other injected provider) via window.ethereum without needing @metamask/sdk.
// metaMaskWallet dynamically imports @metamask/sdk which fails in production builds.
export const wagmiConfig = getDefaultConfig({
  appName: 'AgentScope',
  projectId,
  chains: [mainnet, base, celo],
  ssr: true,
  wallets: [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet, walletConnectWallet, coinbaseWallet, rainbowWallet],
    },
  ],
})
