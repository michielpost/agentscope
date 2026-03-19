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
      <ConnectButton />
    </header>
  )
}
