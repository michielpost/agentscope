import { DollarSign, Bot, Zap, AlertTriangle } from 'lucide-react'
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

// TODO: Replace with real API calls to each protocol

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
      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Spend (30d)"
          value={`$${agentSummary.totalSpendUsd.toFixed(2)}`}
          subtitle="Across all protocols"
          icon={DollarSign}
          trend={{ value: '12% vs last month', up: true }}
          color="text-emerald-400"
        />
        <StatCard
          title="Active Agents"
          value={String(agentSummary.activeAgents)}
          subtitle="Running right now"
          icon={Bot}
          color="text-blue-400"
        />
        <StatCard
          title="Tasks In Progress"
          value={String(agentSummary.tasksInProgress)}
          subtitle="Pending completion"
          icon={Zap}
          trend={{ value: '3 new since yesterday', up: true }}
          color="text-violet-400"
        />
        <StatCard
          title="Alerts"
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
    </div>
  )
}
