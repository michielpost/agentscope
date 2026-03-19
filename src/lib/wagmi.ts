import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'
import { mainnet, base, celo } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo'

// Only use injectedWallet (window.ethereum) — no @metamask/sdk, no
// @walletconnect/ethereum-provider, no Coinbase SDK needed at runtime.
// All injected wallets (MetaMask, Brave, Rabby, etc.) are detected automatically.
export const wagmiConfig = getDefaultConfig({
  appName: 'AgentScope',
  projectId,
  chains: [mainnet, base, celo],
  ssr: true,
  wallets: [
    {
      groupName: 'Detected Wallets',
      wallets: [injectedWallet],
    },
  ],
})
