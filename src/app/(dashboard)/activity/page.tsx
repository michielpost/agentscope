'use client'

import { useState, useMemo } from 'react'
import { ExternalLink, Wifi, WifiOff } from 'lucide-react'
import { useAccount } from 'wagmi'
import { agentActivities as mockActivities } from '@/lib/mock-data-activity'
import type { AgentActivity } from '@/lib/mock-data-activity'
import { useCeloTransactions } from '@/hooks/useCelo'
import { useUniswapSwaps } from '@/hooks/useUniswap'
import { useBankrUsage } from '@/hooks/useBankr'
import { useMetaMaskDelegations } from '@/hooks/useMetaMask'
import { useOctantAllocations } from '@/hooks/useOctant'
import { formatTimeAgo } from '@/lib/utils'
import type { CeloTransaction, UniswapSwap, BankrUsage, Delegation, OctantAllocation } from '@/types'

type Protocol = 'all' | 'uniswap' | 'celo' | 'metamask' | 'bankr' | 'superrare' | 'octant' | 'olas' | 'settlement' | 'venice' | 'base'

const PROTOCOL_STYLES: Record<string, { label: string; dot: string; text: string; activeBg: string; activeBorder: string }> = {
  uniswap:    { label: 'Uniswap',    dot: 'bg-pink-500',   text: 'text-pink-400',   activeBg: 'bg-pink-500/20',   activeBorder: 'border-pink-500' },
  celo:       { label: 'Celo',       dot: 'bg-green-500',  text: 'text-green-400',  activeBg: 'bg-green-500/20',  activeBorder: 'border-green-500' },
  metamask:   { label: 'MetaMask',   dot: 'bg-orange-500', text: 'text-orange-400', activeBg: 'bg-orange-500/20', activeBorder: 'border-orange-500' },
  bankr:      { label: 'Bankr',      dot: 'bg-blue-500',   text: 'text-blue-400',   activeBg: 'bg-blue-500/20',   activeBorder: 'border-blue-500' },
  superrare:  { label: 'SuperRare',  dot: 'bg-violet-500', text: 'text-violet-400', activeBg: 'bg-violet-500/20', activeBorder: 'border-violet-500' },
  octant:     { label: 'Octant',     dot: 'bg-teal-500',   text: 'text-teal-400',   activeBg: 'bg-teal-500/20',   activeBorder: 'border-teal-500' },
  olas:       { label: 'Olas',       dot: 'bg-indigo-500', text: 'text-indigo-400', activeBg: 'bg-indigo-500/20', activeBorder: 'border-indigo-500' },
  settlement: { label: 'Settlement', dot: 'bg-cyan-500',   text: 'text-cyan-400',   activeBg: 'bg-cyan-500/20',   activeBorder: 'border-cyan-500' },
  venice:     { label: 'Venice',     dot: 'bg-purple-500', text: 'text-purple-400', activeBg: 'bg-purple-500/20', activeBorder: 'border-purple-500' },
  base:       { label: 'Base',       dot: 'bg-sky-500',    text: 'text-sky-400',    activeBg: 'bg-sky-500/20',    activeBorder: 'border-sky-500' },
}

const STATUS_STYLES = {
  completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  pending:   'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  failed:    'text-red-400 bg-red-500/10 border-red-500/30',
}

const FILTERS: { value: Protocol; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'uniswap', label: 'Uniswap' },
  { value: 'celo', label: 'Celo' },
  { value: 'metamask', label: 'MetaMask' },
  { value: 'bankr', label: 'Bankr' },
  { value: 'superrare', label: 'SuperRare' },
  { value: 'octant', label: 'Octant' },
  { value: 'olas', label: 'Olas' },
  { value: 'settlement', label: 'Settlement' },
  { value: 'venice', label: 'Venice' },
  { value: 'base', label: 'Base' },
]

function truncateTxHash(hash: string) {
  return hash.slice(0, 6) + '...' + hash.slice(-4)
}

function txLink(protocol: string, hash: string) {
  if (protocol === 'celo') return `https://celoscan.io/tx/${hash}`
  if (protocol === 'uniswap') return `https://etherscan.io/tx/${hash}`
  if (protocol === 'settlement') return `https://arbiscan.io/tx/${hash}`
  return `https://etherscan.io/tx/${hash}`
}

// --- converters from live data types → AgentActivity ---

function celoTxToActivity(tx: CeloTransaction): AgentActivity {
  const short = (a: string) => a.slice(0, 6) + '…' + a.slice(-4)
  return {
    id: `celo-${tx.hash}`,
    protocol: 'celo',
    action: tx.from.toLowerCase() === tx.to.toLowerCase() ? 'Contract interaction' : 'Token transfer',
    detail: `${parseFloat(tx.value).toFixed(4)} ${tx.token} → ${short(tx.to)}`,
    timestamp: tx.timestamp,
    txHash: tx.hash,
    status: tx.status === 'success' ? 'completed' : tx.status === 'failed' ? 'failed' : 'pending',
    costUsd: parseFloat(tx.value) * 0.001, // gas approx
  }
}

function uniswapSwapToActivity(swap: UniswapSwap): AgentActivity {
  return {
    id: `uniswap-${swap.id}`,
    protocol: 'uniswap',
    action: 'Executed swap',
    detail: `${parseFloat(swap.amountIn).toFixed(4)} ${swap.tokenIn} → ${parseFloat(swap.amountOut).toFixed(4)} ${swap.tokenOut} on ${swap.network}`,
    timestamp: swap.timestamp,
    txHash: swap.txHash,
    status: 'completed',
    costUsd: parseFloat(swap.amountIn) * 0.003, // 0.3% fee estimate
  }
}

function bankrUsageToActivity(usage: BankrUsage, idx: number): AgentActivity {
  return {
    id: `bankr-${idx}-${usage.date}`,
    protocol: 'bankr',
    action: 'LLM inference',
    detail: `Model: ${usage.model} · ${(usage.inputTokens + usage.outputTokens).toLocaleString()} tokens`,
    timestamp: new Date(usage.date).getTime() / 1000,
    status: 'completed',
    costUsd: usage.costUsd,
  }
}

function delegationToActivity(d: Delegation): AgentActivity {
  return {
    id: `metamask-${d.id}`,
    protocol: 'metamask',
    action: d.active ? 'Delegation granted' : 'Delegation revoked',
    detail: `Delegate: ${d.delegate.slice(0, 8)}…${d.delegate.slice(-4)}${d.spendLimit ? ` · Limit: ${d.spendLimit}` : ''}`,
    timestamp: d.createdAt,
    status: 'completed',
  }
}

function octantAllocationToActivity(a: OctantAllocation): AgentActivity {
  return {
    id: `octant-${a.projectAddress}-${a.epoch}`,
    protocol: 'octant',
    action: 'Funding allocated',
    detail: `${parseFloat(a.amount).toFixed(4)} GLM → ${a.projectName} (Epoch ${a.epoch})`,
    timestamp: a.timestamp,
    status: 'completed',
    costUsd: 0,
  }
}

export default function ActivityPage() {
  const { address, isConnected } = useAccount()
  const [activeFilter, setActiveFilter] = useState<Protocol>('all')

  const { data: celoTxs, loading: celoLoading } = useCeloTransactions()
  const { data: uniswapSwaps, loading: uniLoading } = useUniswapSwaps()
  const { data: bankrUsage, loading: bankrLoading } = useBankrUsage()
  const { data: delegations, loading: mmLoading } = useMetaMaskDelegations()
  const { data: octantAllocations, loading: octantLoading } = useOctantAllocations()

  const loading = celoLoading || uniLoading || bankrLoading || mmLoading || octantLoading

  const liveActivities = useMemo<AgentActivity[]>(() => {
    if (!isConnected) return mockActivities

    const items: AgentActivity[] = [
      ...celoTxs.map(celoTxToActivity),
      ...uniswapSwaps.map(uniswapSwapToActivity),
      ...bankrUsage.map(bankrUsageToActivity),
      ...delegations.map(delegationToActivity),
      ...octantAllocations.map(octantAllocationToActivity),
    ]

    // Fall back to mock if we got nothing real
    if (items.length === 0) return mockActivities

    return items.sort((a, b) => b.timestamp - a.timestamp)
  }, [isConnected, celoTxs, uniswapSwaps, bankrUsage, delegations, octantAllocations])

  const totalCost = useMemo(
    () => liveActivities.reduce((sum, a) => sum + (a.costUsd ?? 0), 0),
    [liveActivities]
  )

  const filtered = useMemo(
    () => activeFilter === 'all' ? liveActivities : liveActivities.filter(a => a.protocol === activeFilter),
    [activeFilter, liveActivities]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Activity</h1>
          <p className="text-sm text-gray-400 mt-1">All actions taken by your agent across protocols</p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
          isConnected
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
        }`}>
          {isConnected ? (
            <><div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /><Wifi size={10} />Live · {address?.slice(0, 6)}…{address?.slice(-4)}</>
          ) : (
            <><WifiOff size={10} />Mock data — connect wallet</>
          )}
        </div>
      </div>

      {/* Cost summary */}
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-sm text-gray-400">Total cost: </span>
          <span className="text-sm font-semibold text-emerald-400">${totalCost.toFixed(2)}</span>
        </div>
        <span className="text-xs text-gray-500">{liveActivities.length} activities</span>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value
          const style = f.value !== 'all' ? PROTOCOL_STYLES[f.value] : null
          const count = f.value === 'all' ? liveActivities.length : liveActivities.filter(a => a.protocol === f.value).length
          if (f.value !== 'all' && count === 0) return null
          return (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={[
                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                isActive
                  ? style
                    ? `${style.activeBg} ${style.activeBorder} ${style.text}`
                    : 'bg-white/10 border-white/30 text-white'
                  : 'border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-200',
              ].join(' ')}
            >
              {f.label} <span className="opacity-50 ml-1">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Loading state */}
      {loading && isConnected && (
        <div className="text-center py-8 text-gray-500 text-sm animate-pulse">Loading live activity…</div>
      )}

      {/* Timeline */}
      {!loading && (
        <div className="relative">
          <div className="absolute left-[7px] top-0 bottom-0 w-px bg-white/10" />
          <div className="space-y-3 pl-6">
            {filtered.map((activity) => {
              const ps = PROTOCOL_STYLES[activity.protocol]
              return (
                <div key={activity.id} className="relative">
                  <span className={`absolute -left-6 top-3.5 h-3.5 w-3.5 rounded-full border-2 border-[#08080e] ${ps.dot}`} />
                  <div className="rounded-lg border border-white/5 bg-white/3 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold uppercase tracking-wider ${ps.text}`}>{ps.label}</span>
                          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[activity.status]}`}>
                            {activity.status}
                          </span>
                          {activity.settlementType && (
                            <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium text-cyan-400 font-mono">
                              {activity.settlementType}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-200">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{activity.detail}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-600">{formatTimeAgo(activity.timestamp)}</span>
                          {activity.txHash && (
                            <a
                              href={txLink(activity.protocol, activity.txHash)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
                            >
                              {truncateTxHash(activity.txHash)} <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                      {activity.costUsd !== undefined && activity.costUsd > 0 && (
                        <span className="shrink-0 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                          ${activity.costUsd.toFixed(4)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
            {filtered.length === 0 && (
              <p className="text-sm text-gray-500 py-8 text-center">No activity for this protocol yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
