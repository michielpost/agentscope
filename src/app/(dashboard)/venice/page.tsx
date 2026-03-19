'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Brain, Zap, ExternalLink } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import {
  getMockInferenceHistory,
  getVeniceModels,
  getVeniceStats,
  type VeniceModel,
  type VeniceInferenceCall,
} from '@/lib/services/venice'
import { formatTimeAgo } from '@/lib/utils'

const TYPE_BADGE: Record<string, string> = {
  text:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  image: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  tts:   'bg-blue-500/20 text-blue-300 border-blue-500/30',
  code:  'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
}

const CATEGORY_BADGE: Record<string, string> = {
  data:     'bg-sky-500/20 text-sky-300 border-sky-500/30',
  compute:  'bg-purple-500/20 text-purple-300 border-purple-500/30',
  storage:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  oracle:   'bg-orange-500/20 text-orange-300 border-orange-500/30',
  identity: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
}

const STATUS_STYLES = {
  completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  failed:    'text-red-400 bg-red-500/10 border-red-500/30',
}

function formatContext(ctx?: number): string {
  if (!ctx) return '—'
  if (ctx >= 1000) return `${(ctx / 1000).toFixed(0)}k`
  return String(ctx)
}

export default function VenicePage() {
  const [models, setModels] = useState<VeniceModel[]>([])
  const [modelsLoading, setModelsLoading] = useState(true)

  const history: VeniceInferenceCall[] = getMockInferenceHistory()
  const stats = getVeniceStats(history)

  useEffect(() => {
    getVeniceModels().then((m) => {
      setModels(m)
      setModelsLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Lock size={22} className="text-purple-400" />
            Venice
          </h1>
          <p className="text-sm text-gray-400 mt-1">Private Agents, Trusted Actions</p>
        </div>
        <a
          href="https://venice.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-purple-500/20 bg-purple-500/5 px-3 py-1.5 text-xs text-purple-300 hover:bg-purple-500/10 transition-colors"
        >
          venice.ai <ExternalLink size={12} />
        </a>
      </div>

      {/* Privacy banner */}
      <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 px-4 py-3">
        <div className="flex items-start gap-3">
          <Shield size={16} className="text-purple-400 mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-purple-300">Privacy Guarantee</p>
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                No Data Retention
              </span>
            </div>
            <p className="text-xs text-gray-400">
              All inference calls are processed with zero data retention. Your agent&apos;s reasoning stays private — no training on your prompts, no logs retained after the response.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Calls"
          value={String(stats.totalCalls)}
          subtitle="All inference requests"
          icon={Brain}
          color="text-purple-400"
        />
        <StatCard
          title="Total Tokens"
          value={stats.totalTokens.toLocaleString()}
          subtitle="Prompt + completion"
          icon={Zap}
          color="text-purple-400"
        />
        <StatCard
          title="Total Cost (VVV)"
          value={stats.totalCostVVV.toFixed(4)}
          subtitle={`$${stats.totalCostUsd.toFixed(2)} USD`}
          icon={Shield}
          color="text-purple-400"
        />
        <StatCard
          title="Web Search Calls"
          value={String(stats.webSearchCalls)}
          subtitle="Calls with live search"
          icon={ExternalLink}
          color="text-purple-400"
        />
      </div>

      {/* Models grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Models Available</h2>
        {modelsLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-28 rounded-xl border border-white/5 bg-white/3 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="rounded-xl border border-purple-500/10 bg-purple-500/5 p-4 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-medium text-purple-200 break-all leading-tight">
                    {model.id}
                  </span>
                  <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${TYPE_BADGE[model.type] ?? TYPE_BADGE.text}`}>
                    {model.type}
                  </span>
                </div>
                {model.contextLength && (
                  <p className="text-xs text-gray-500">
                    Context: <span className="text-gray-300">{formatContext(model.contextLength)}</span>
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {model.supportsVision && (
                    <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-1.5 py-0.5 text-[9px] text-violet-300">Vision</span>
                  )}
                  {model.supportsWebSearch && (
                    <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 text-[9px] text-sky-300">Web Search</span>
                  )}
                  {model.supportsToolCalling && (
                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] text-emerald-300">Tools</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inference history table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Inference History</h2>
        <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Task</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tokens</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Search</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((call) => (
                  <tr key={call.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatTimeAgo(call.timestamp)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="font-mono text-xs text-purple-300">{call.model}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-300 max-w-[280px] truncate">{call.task}</span>
                        <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[9px] text-purple-300">
                          🔒 Private
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {call.totalTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-xs">
                        <span className="text-purple-300">{call.costVVV.toFixed(4)} VVV</span>
                        <span className="text-gray-600 ml-1">${call.costUsd.toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {call.webSearchEnabled ? (
                        <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 text-[9px] text-sky-300">On</span>
                      ) : (
                        <span className="text-xs text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[call.status]}`}>
                        {call.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
