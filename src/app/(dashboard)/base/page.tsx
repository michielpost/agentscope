'use client'

import { Zap, Globe, ExternalLink, Clock, CheckCircle2, XCircle, Database, Cpu, Shield, Layers } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import {
  getMockX402Payments,
  getMockAgentServices,
  BASE_EXPLORER,
  type X402Payment,
  type AgentService,
} from '@/lib/services/base'
import { formatTimeAgo } from '@/lib/utils'

const STATUS_STYLES = {
  completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  pending:   'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  failed:    'text-red-400 bg-red-500/10 border-red-500/30',
}

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  data:     <Database size={14} className="text-sky-400" />,
  compute:  <Cpu size={14} className="text-purple-400" />,
  storage:  <Layers size={14} className="text-amber-400" />,
  oracle:   <Globe size={14} className="text-orange-400" />,
  identity: <Shield size={14} className="text-teal-400" />,
}

const CATEGORY_BADGE: Record<string, string> = {
  data:     'border-sky-500/30 bg-sky-500/10 text-sky-300',
  compute:  'border-purple-500/30 bg-purple-500/10 text-purple-300',
  storage:  'border-amber-500/30 bg-amber-500/10 text-amber-300',
  oracle:   'border-orange-500/30 bg-orange-500/10 text-orange-300',
  identity: 'border-teal-500/30 bg-teal-500/10 text-teal-300',
}

function truncateUrl(url: string, maxLen = 42): string {
  try {
    const u = new URL(url)
    const path = u.hostname + u.pathname
    return path.length > maxLen ? path.slice(0, maxLen) + '…' : path
  } catch {
    return url.slice(0, maxLen)
  }
}

function truncateTxHash(hash: string): string {
  return hash.slice(0, 6) + '...' + hash.slice(-4)
}

function StatusIcon({ status }: { status: X402Payment['status'] }) {
  if (status === 'completed') return <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
  if (status === 'failed') return <XCircle size={14} className="text-red-400 shrink-0" />
  return <Clock size={14} className="text-yellow-400 shrink-0" />
}

export default function BasePage() {
  const payments: X402Payment[] = getMockX402Payments()
  const services: AgentService[] = getMockAgentServices()

  const completed = payments.filter(p => p.status === 'completed')
  const totalSpent = completed.reduce((s, p) => s + p.amountUsd, 0)
  const avgResponseTime = completed.filter(p => p.responseTime > 0).reduce((s, p, _, a) => s + p.responseTime / a.length, 0)
  const uniqueServices = new Set(payments.map(p => p.service)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers size={22} className="text-sky-400" />
            Base
          </h1>
          <p className="text-sm text-gray-400 mt-1">Agent Services · x402 Payments</p>
        </div>
        <a
          href="https://base.org"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs text-blue-300 hover:bg-blue-500/10 transition-colors"
        >
          base.org <ExternalLink size={12} />
        </a>
      </div>

      {/* x402 explainer banner */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-3">
        <div className="flex items-start gap-3">
          <Zap size={16} className="text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-300 mb-1">x402 — HTTP-Native Agent Payments</p>
            <p className="text-xs text-gray-400">
              x402 is the HTTP-native payment standard for agents. When a service returns 402 Payment Required, your agent pays instantly with USDC on Base — no accounts, no API keys, no friction.{' '}
              <a
                href="https://x402.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
              >
                x402.org <ExternalLink size={10} className="inline" />
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total x402 Payments"
          value={String(payments.length)}
          subtitle="HTTP 402 flows completed"
          icon={Zap}
          color="text-sky-400"
        />
        <StatCard
          title="Total Spent"
          value={`$${totalSpent.toFixed(2)} USDC`}
          subtitle="On Base mainnet"
          icon={Globe}
          color="text-sky-400"
        />
        <StatCard
          title="Avg Response Time"
          value={`${Math.round(avgResponseTime)} ms`}
          subtitle="402 → access granted"
          icon={Clock}
          color="text-sky-400"
        />
        <StatCard
          title="Services Used"
          value={String(uniqueServices)}
          subtitle="Distinct x402 endpoints"
          icon={Layers}
          color="text-sky-400"
        />
      </div>

      {/* x402 Payment History */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">x402 Payment History</h2>
        <div className="rounded-xl border border-white/10 bg-white/3 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Tx</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                      {formatTimeAgo(p.timestamp)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-200 whitespace-nowrap">
                      {p.service}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-[10px] text-gray-500">{truncateUrl(p.serviceUrl)}</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs font-medium text-sky-300">{p.amount}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                      {p.responseTime > 0 ? `${p.responseTime} ms` : '—'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <a
                        href={`${BASE_EXPLORER}/tx/${p.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-mono text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {truncateTxHash(p.txHash)} <ExternalLink size={9} />
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <StatusIcon status={p.status} />
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[p.status]}`}>
                          {p.status}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Discoverable Agent Services */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">Discoverable Agent Services</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {services.map((svc) => (
            <div
              key={svc.name}
              className="rounded-xl border border-white/10 bg-white/3 p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {CATEGORY_ICON[svc.category]}
                    <span className="text-sm font-semibold text-white">{svc.name}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${CATEGORY_BADGE[svc.category]}`}>
                      {svc.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{svc.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-sky-300 font-medium">{svc.price}</span>
                <span className="text-gray-500">{svc.totalRequests.toLocaleString()} requests</span>
              </div>
              <div className="flex items-center gap-1">
                <a
                  href={svc.endpoint}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-gray-600 hover:text-gray-400 transition-colors truncate flex items-center gap-1"
                >
                  {truncateUrl(svc.endpoint, 50)} <ExternalLink size={9} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AgentScope as x402 Service callout */}
      <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 shrink-0">
            <Zap size={18} className="text-blue-400" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start gap-3">
              <h3 className="text-sm font-semibold text-white">AgentScope as an x402 Service</h3>
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                Live
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The dashboard feed endpoint can be monetised — other agents pay USDC on Base to query your agent&apos;s activity. Any agent on any chain can discover and access your data using standard HTTP 402 flows.
            </p>
            <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/3 px-3 py-2">
              <code className="flex-1 font-mono text-[11px] text-blue-300 break-all">
                https://dashboard-three-smoky-78.vercel.app/api/feed
              </code>
              <ExternalLink size={12} className="text-gray-600 shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
