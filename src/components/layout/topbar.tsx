'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { useAccount } from 'wagmi'

const pageTitles: Record<string, string> = {
  '/overview': 'Overview',
  '/uniswap': 'Uniswap',
  '/celo': 'Celo',
  '/metamask': 'MetaMask Delegations',
  '/bankr': 'Bankr LLM Gateway',
  '/superrare': 'SuperRare',
  '/octant': 'Octant',
  '/olas': 'Olas / Pearl',
}

function safeBalance(formatted: string | undefined): string {
  if (!formatted) return '0'
  const n = parseFloat(formatted)
  return isNaN(n) ? '0' : n.toFixed(4)
}

export function Topbar() {
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const title = pageTitles[pathname] ?? 'AgentScope'

  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#08080e] px-6">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
        {!isConnected && (
          <Badge variant="warning">Demo Mode</Badge>
        )}
      </div>
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
          const connected = mounted && account && chain
          return (
            <div {...(!mounted && { 'aria-hidden': true, style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' } })}>
              {!connected ? (
                <button onClick={openConnectModal} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors">
                  Connect Wallet
                </button>
              ) : chain.unsupported ? (
                <button onClick={openChainModal} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 transition-colors">
                  Wrong Network
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={openChainModal} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    {chain.hasIcon && chain.iconUrl && (
                      <img src={chain.iconUrl} alt={chain.name} className="h-4 w-4 rounded-full" />
                    )}
                    <span>{chain.name}</span>
                  </button>
                  <button onClick={openAccountModal} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors">
                    {account.balanceFormatted !== undefined && (
                      <span className="text-emerald-400 font-medium">
                        {safeBalance(account.balanceFormatted)} {account.balanceSymbol ?? 'ETH'}
                      </span>
                    )}
                    <span>{account.displayName}</span>
                  </button>
                </div>
              )}
            </div>
          )
        }}
      </ConnectButton.Custom>
    </header>
  )
}
