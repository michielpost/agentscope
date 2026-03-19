'use client'
import { Brain, DollarSign, Cpu, BarChart2 } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BankrUsageChart } from '@/components/charts/BankrUsageChart'
import { useBankrUsage, useBankrLimits } from '@/hooks/useBankr'

export default function BankrPage() {
  const { data: bankrUsage, loading: usageLoading } = useBankrUsage()
  const { data: bankrLimits, loading: limitsLoading } = useBankrLimits()

  const totalCostToday = bankrUsage
    .filter((u) => u.date === new Date().toISOString().slice(0, 10))
    .reduce((sum, u) => sum + u.costUsd, 0)
  const totalTokens = bankrUsage.reduce(
    (sum, u) => sum + u.inputTokens + u.outputTokens,
    0
  )
  const uniqueModels = [...new Set(bankrUsage.map((u) => u.model))].length
  const requestsToday = bankrUsage.filter(
    (u) => u.date === new Date().toISOString().slice(0, 10)
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-blue-400">◈</span> Agent LLM Usage
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          API calls made by your agent through the Bankr LLM Gateway
        </p>
      </div>

      {/* Live data banner */}
      <div className="rounded-lg border border-blue-400/30 bg-blue-400/10 px-4 py-3 text-sm text-blue-300">
        Connect your Bankr API key to see your agent's live model usage and costs.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {usageLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Cost Today"
              value={`$${totalCostToday.toFixed(3)}`}
              subtitle="All models combined"
              icon={DollarSign}
              color="text-blue-400"
            />
            <StatCard
              title="Total Tokens"
              value={totalTokens.toLocaleString()}
              subtitle="Input + output combined"
              icon={Cpu}
              color="text-blue-400"
            />
            <StatCard
              title="Models Used"
              value={String(uniqueModels)}
              subtitle="Active model configurations"
              icon={Brain}
              color="text-blue-400"
            />
            <StatCard
              title="Requests Today"
              value={String(requestsToday)}
              subtitle="API calls completed"
              icon={BarChart2}
              color="text-blue-400"
            />
          </>
        )}
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Cost by Model — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent>
          <BankrUsageChart />
        </CardContent>
      </Card>

      {/* Usage Table + Limits side by side */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Usage Table */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Usage Log</CardTitle>
            </CardHeader>
            <CardContent>
              {usageLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Model</th>
                        <th>Input Tokens</th>
                        <th>Output Tokens</th>
                        <th>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bankrUsage.map((entry, i) => (
                        <tr key={i}>
                          <td className="text-gray-400">{entry.date}</td>
                          <td>
                            <span className="font-mono text-xs text-blue-300">
                              {entry.model}
                            </span>
                          </td>
                          <td>{entry.inputTokens.toLocaleString()}</td>
                          <td>{entry.outputTokens.toLocaleString()}</td>
                          <td className="text-emerald-400">${entry.costUsd.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Limits Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Daily Limits</CardTitle>
            </CardHeader>
            <CardContent>
              {limitsLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-5">
                  {bankrLimits.map((limit) => {
                    const pct = (limit.used / limit.dailyLimit) * 100
                    return (
                      <div key={limit.model}>
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-mono text-blue-300">{limit.model}</span>
                          <span className="text-gray-400">
                            ${limit.used.toFixed(2)} / ${limit.dailyLimit.toFixed(2)}
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-white/10">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          ${limit.remaining.toFixed(2)} remaining
                        </p>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
