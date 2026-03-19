'use client'

import { useState, useMemo } from 'react'
import { ExternalLink } from 'lucide-react'
import { agentActivities } from '@/lib/mock-data-activity'
import { formatTimeAgo } from '@/lib/utils'

type Protocol = 'all' | 'uniswap' | 'celo' | 'metamask' | 'bankr' | 'superrare' | 'octant' | 'olas'

const PROTOCOL_STYLES: Record<string, { label: string; dot: string; text: string; activeBg: string; activeBorder: string }> = {
  uniswap:   { label: 'Uniswap',   dot: 'bg-pink-500',   text: 'text-pink-400',   activeBg: 'bg-pink-500/20',   activeBorder: 'border-pink-500' },
  celo:      { label: 'Celo',      dot: 'bg-green-500',  text: 'text-green-400',  activeBg: 'bg-green-500/20',  activeBorder: 'border-green-500' },
  metamask:  { label: 'MetaMask',  dot: 'bg-orange-500', text: 'text-orange-400', activeBg: 'bg-orange-500/20', activeBorder: 'border-orange-500' },
  bankr:     { label: 'Bankr',     dot: 'bg-blue-500',   text: 'text-blue-400',   activeBg: 'bg-blue-500/20',   activeBorder: 'border-blue-500' },
  superrare: { label: 'SuperRare', dot: 'bg-violet-500', text: 'text-violet-400', activeBg: 'bg-violet-500/20', activeBorder: 'border-violet-500' },
  octant:    { label: 'Octant',    dot: 'bg-teal-500',   text: 'text-teal-400',   activeBg: 'bg-teal-500/20',   activeBorder: 'border-teal-500' },
  olas:      { label: 'Olas',      dot: 'bg-indigo-500', text: 'text-indigo-400', activeBg: 'bg-indigo-500/20', activeBorder: 'border-indigo-500' },
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
]

function truncateTxHash(hash: string) {
  return hash.slice(0, 6) + '...' + hash.slice(-4)
}

export default function ActivityPage() {
  const [activeFilter, setActiveFilter] = useState<Protocol>('all')

  const totalCost = useMemo(
    () => agentActivities.reduce((sum, a) => sum + (a.costUsd ?? 0), 0),
    []
  )

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? agentActivities
        : agentActivities.filter((a) => a.protocol === activeFilter),
    [activeFilter]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Agent Activity</h1>
        <p className="text-sm text-gray-400 mt-1">All actions taken by your agent across protocols</p>
      </div>

      {/* Cost summary */}
      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
        <span className="text-sm text-gray-400">Total cost last 14 days: </span>
        <span className="text-sm font-semibold text-emerald-400">${totalCost.toFixed(2)}</span>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value
          const style = f.value !== 'all' ? PROTOCOL_STYLES[f.value] : null
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
              {f.label}
            </button>
          )
        })}
      </div>

      {/* Timeline */}
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
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[activity.status]}`}
                        >
                          {activity.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-200">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{activity.detail}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-600">{formatTimeAgo(activity.timestamp)}</span>
                        {activity.txHash && (
                          <a
                            href={`https://etherscan.io/tx/${activity.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors font-mono"
                          >
                            {truncateTxHash(activity.txHash)} <ExternalLink size={10} />
                          </a>
                        )}
                      </div>
                    </div>
                    {activity.costUsd !== undefined && (
                      <span className="shrink-0 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                        ${activity.costUsd.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
