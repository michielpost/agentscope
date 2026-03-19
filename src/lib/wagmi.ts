import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, base, celo } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'AgentScope',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'demo',
  chains: [mainnet, base, celo],
  ssr: true,
})
