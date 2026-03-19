import { DollarSign, Bot, Zap, AlertTriangle, Fingerprint, ExternalLink } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DailySpendChart } from '@/components/charts/DailySpendChart'
import {
  agentSummary,
  uniswapSwaps,
  celoTransactions,
  olasAgents,
} from '@/lib/mock-data'
import { truncateAddress, formatTimeAgo } from '@/lib/utils'

const recentActivity = [
  ...uniswapSwaps.slice(0, 3).map((s) => ({
    id: s.id,
    description: `Swapped ${s.amountIn} ${s.tokenIn} → ${s.amountOut} ${s.tokenOut}`,
    protocol: 'Uniswap',
    timestamp: s.timestamp,
    color: 'text-pink-400',
  })),
  ...celoTransactions.slice(0, 2).map((t) => ({
    id: t.hash,
    description: `Sent ${t.value} ${t.token} to ${truncateAddress(t.to)}`,
    protocol: 'Celo',
    timestamp: t.timestamp,
    color: 'text-green-400',
  })),
].sort((a, b) => b.timestamp - a.timestamp)

export default function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Your Agent&apos;s Activity</h1>
        <p className="text-sm text-gray-400 mt-1">Real-time view of what your agent is doing across Web3 protocols</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Agent Spend (30d)"
          value={`$${agentSummary.totalSpendUsd.toFixed(2)}`}
          subtitle="Across all protocols"
          icon={DollarSign}
          trend={{ value: '12% vs last month', up: true }}
          color="text-emerald-400"
        />
        <StatCard
          title="Active Agent Services"
          value={String(agentSummary.activeAgents)}
          subtitle="Running right now"
          icon={Bot}
          color="text-blue-400"
        />
        <StatCard
          title="Pending Actions"
          value={String(agentSummary.tasksInProgress)}
          subtitle="Pending completion"
          icon={Zap}
          trend={{ value: '3 new since yesterday', up: true }}
          color="text-violet-400"
        />
        <StatCard
          title="Permission Alerts"
          value={String(agentSummary.alerts)}
          subtitle="Require attention"
          icon={AlertTriangle}
          color="text-amber-400"
        />
      </div>

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
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-white/5 bg-white/3 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatTimeAgo(item.timestamp)}</p>
                  </div>
                  <span className={`text-xs font-medium shrink-0 ${item.color}`}>
                    {item.protocol}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Agent Status */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {olasAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/5 bg-white/3 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200 truncate">{agent.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{agent.network} · {agent.stakedAmount} OLAS staked</p>
                  </div>
                  <Badge
                    variant={
                      agent.status === 'active'
                        ? 'success'
                        : agent.status === 'idle'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {agent.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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
              <p className="text-xs text-gray-500">7 protocols connected</p>
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
