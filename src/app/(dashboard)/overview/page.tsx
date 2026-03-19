'use client'

import { DollarSign, Bot, Zap, AlertTriangle, Fingerprint, ExternalLink, Wallet, TrendingUp, Activity } from 'lucide-react'
import { useAccount } from 'wagmi'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { DailySpendChart } from '@/components/charts/DailySpendChart'
import { useCeloBalances, useCeloTransactions } from '@/hooks/useCelo'
import { useUniswapSwaps, useUniswapPositions } from '@/hooks/useUniswap'
import { useOlasAgents } from '@/hooks/useOlas'
import { useBankrUsage } from '@/hooks/useBankr'
import { agentSummary } from '@/lib/mock-data'
import { truncateAddress, formatTimeAgo } from '@/lib/utils'

export default function OverviewPage() {
  const { address, isConnected } = useAccount()

  const { data: celoBalances, loading: celoLoading } = useCeloBalances()
  const { data: celoTxs, loading: txLoading } = useCeloTransactions()
  const { data: swaps, loading: swapsLoading } = useUniswapSwaps()
  const { data: positions, loading: posLoading } = useUniswapPositions()
  const { data: olasAgents, loading: olasLoading } = useOlasAgents()
  const { data: bankrUsage } = useBankrUsage()

  const loading = celoLoading || txLoading || swapsLoading || posLoading

  // Compute real stats from live data
  const celoUsdTotal = celoBalances.reduce((s, b) => s + parseFloat(b.usdValue ?? '0'), 0)
  const uniswapVolume = swaps.reduce((s, sw) => s + parseFloat(sw.amountIn ?? '0'), 0)
  const bankrSpend = bankrUsage.reduce((s, u) => s + (u.costUsd ?? 0), 0)
  const totalSpend = isConnected ? (celoUsdTotal + uniswapVolume * 0.003 + bankrSpend) : agentSummary.totalSpendUsd

  const activeOlas = olasAgents.filter(a => a.status === 'active').length
  const activeDelegations = positions.length

  // Build unified activity feed from live sources
  const recentActivity = [
    ...swaps.slice(0, 4).map(s => ({
      id: s.id,
      description: `Swapped ${parseFloat(s.amountIn).toFixed(4)} ${s.tokenIn} → ${parseFloat(s.amountOut).toFixed(4)} ${s.tokenOut}`,
      protocol: 'Uniswap',
      timestamp: s.timestamp,
      color: 'text-pink-400',
      icon: '🦄',
    })),
    ...celoTxs.slice(0, 3).map(t => ({
      id: t.hash,
      description: `Sent ${parseFloat(t.value).toFixed(2)} ${t.token} to ${truncateAddress(t.to)}`,
      protocol: 'Celo',
      timestamp: t.timestamp,
      color: 'text-green-400',
      icon: '🌿',
    })),
    ...bankrUsage.slice(0, 2).map((u, i) => ({
      id: `bankr-${i}`,
      description: `LLM call: ${u.model} — ${u.inputTokens.toLocaleString()} tokens ($${u.costUsd.toFixed(3)})`,
      protocol: 'Bankr',
      timestamp: Math.floor(new Date(u.date).getTime() / 1000),
      color: 'text-sky-400',
      icon: '🧠',
    })),
  ].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8)

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Your Agent&apos;s Activity</h1>
          <p className="text-sm text-gray-400 mt-1">Real-time view of what your agent is doing across Web3 protocols</p>
        </div>
        {isConnected && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium font-mono">{truncateAddress(address!)}</span>
          </div>
        )}
        {!isConnected && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5">
            <Wallet size={12} className="text-amber-400" />
            <span className="text-xs text-amber-400 font-medium">Connect wallet for live data</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard
              title={isConnected ? 'Portfolio Value' : 'Agent Spend (30d)'}
              value={`$${totalSpend.toFixed(2)}`}
              subtitle={isConnected ? `${celoBalances.length} token balances` : 'Across all protocols'}
              icon={DollarSign}
              trend={isConnected ? undefined : { value: '12% vs last month', up: true }}
              color="text-emerald-400"
            />
            <StatCard
              title="Active Olas Services"
              value={String(activeOlas || agentSummary.activeAgents)}
              subtitle={`${olasAgents.length} total agents`}
              icon={Bot}
              color="text-blue-400"
            />
            <StatCard
              title={isConnected ? 'Uniswap Positions' : 'Pending Actions'}
              value={String(isConnected ? activeDelegations : agentSummary.tasksInProgress)}
              subtitle={isConnected ? 'Liquidity positions' : 'Pending completion'}
              icon={isConnected ? TrendingUp : Zap}
              color="text-violet-400"
            />
            <StatCard
              title="LLM Calls (recent)"
              value={String(bankrUsage.length)}
              subtitle={`$${bankrSpend.toFixed(3)} spent on inference`}
              icon={Activity}
              color="text-amber-400"
            />
          </>
        )}
      </div>

      {/* Portfolio breakdown when connected */}
      {isConnected && celoBalances.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-emerald-400">🌿</span> Celo Portfolio
              <span className="ml-auto text-sm font-normal text-emerald-400">${celoUsdTotal.toFixed(2)} total</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {celoBalances.map(b => (
                <div key={b.symbol} className="rounded-lg border border-white/5 bg-white/3 p-3 text-center">
                  <p className="text-xs text-gray-400">{b.symbol}</p>
                  <p className="text-lg font-bold text-white mt-0.5">{parseFloat(b.balance).toFixed(4)}</p>
                  <p className="text-xs text-emerald-400">${parseFloat(b.usdValue).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Daily spend chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Agent Spend — Last 14 Days</CardTitle>
          <p className="text-xs text-gray-500 mt-0.5">Gas fees + LLM costs + protocol fees (USD)</p>
        </CardHeader>
        <CardContent>
          <DailySpendChart />
        </CardContent>
      </Card>

      {/* Two-column section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Unified live activity feed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Recent Activity
              {isConnected && <span className="ml-auto text-xs font-normal text-emerald-400 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />Live</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-2">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 rounded-lg border border-white/5 bg-white/3 p-3">
                    <span className="text-base leading-none mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">{item.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(item.timestamp)}</p>
                    </div>
                    <span className={`text-xs font-medium shrink-0 ${item.color}`}>{item.protocol}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle>Olas Agent Status</CardTitle>
          </CardHeader>
          <CardContent>
            {olasLoading ? (
              <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-2">
                {olasAgents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/3 p-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200 truncate">{agent.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{agent.network} · {agent.stakedAmount} OLAS staked</p>
                    </div>
                    <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'idle' ? 'warning' : 'danger'}>
                      {agent.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Uniswap positions when connected */}
      {isConnected && positions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-pink-400">🦄</span> Uniswap Positions
              <span className="ml-auto text-sm font-normal text-pink-400">{positions.length} active</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {positions.map(p => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/3 p-3">
                  <div>
                    <p className="text-sm font-medium text-white">{p.token0}/{p.token1}</p>
                    <p className="text-xs text-gray-400">Fee tier: {p.feeTier} · Fees: ${parseFloat(p.feesEarned).toFixed(4)}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={p.inRange ? 'success' : 'warning'}>{p.inRange ? 'In range' : 'Out of range'}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Agent Identity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint size={18} className="text-amber-400" />
            Agent Identity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-white">GitHub Copilot</p>
              <p className="text-xs text-gray-400 font-mono">7b11d5da...cc6f</p>
              <p className="text-xs text-gray-500">10 protocols connected</p>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center gap-1.5 justify-end">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span>
                <span className="text-xs text-amber-400 font-medium">ERC-8004 · Base Mainnet</span>
              </div>
              <a href="https://basescan.org/tx/0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-amber-400 flex items-center gap-1 justify-end transition-colors">
                0x79cc...2334 <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

