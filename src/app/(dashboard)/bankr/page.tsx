'use client'
import { useState, useCallback } from 'react'
import { Brain, DollarSign, Cpu, BarChart2, Loader2 } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BankrUsageChart } from '@/components/charts/BankrUsageChart'
import { useBankrUsage, useBankrLimits } from '@/hooks/useBankr'

export default function BankrPage() {
  const { data: bankrUsage, loading: usageLoading } = useBankrUsage()
  const { data: bankrLimits, loading: limitsLoading } = useBankrLimits()
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<{
    content: string; model: string; inputTokens: number; outputTokens: number; costUsd: number
  } | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)

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

  const runAnalysis = useCallback(async () => {
    setAnalysisLoading(true)
    setAnalysisError(null)
    setAnalysisResult(null)
    try {
      const res = await fetch('/api/bankr/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `You are analyzing an AI agent's LLM usage through the Bankr Gateway.
Total tokens used: ${totalTokens.toLocaleString()}, across ${uniqueModels} models.
Today's cost: $${totalCostToday.toFixed(3)}. Requests today: ${requestsToday}.
Models used: ${[...new Set(bankrUsage.map(u => u.model))].join(', ')}.

In 2-3 sentences, provide a brief assessment of this agent's LLM usage pattern 
and any cost-optimization recommendations.`,
          model: 'claude-sonnet-4-6',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'API error')
      setAnalysisResult(data)
    } catch (e) {
      setAnalysisError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setAnalysisLoading(false)
    }
  }, [bankrUsage, totalTokens, uniqueModels, totalCostToday, requestsToday])

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

      {/* AI Analysis Section */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain size={18} className="text-blue-400" />
            Analyze with Bankr LLM Gateway
          </CardTitle>
          <p className="text-sm text-gray-400 mt-1">
            Route an analysis request through Bankr&apos;s multi-model AI gateway
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <button
            onClick={runAnalysis}
            disabled={analysisLoading}
            className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-300 hover:bg-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {analysisLoading ? (
              <><Loader2 size={14} className="animate-spin" /> Analyzing…</>
            ) : (
              <><Brain size={14} /> Analyze LLM Usage</>
            )}
          </button>

          {analysisError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              Error: {analysisError}
            </div>
          )}

          {analysisResult && (
            <div className="rounded-lg border border-blue-500/20 bg-black/20 p-4 space-y-3">
              <p className="text-sm text-gray-200 leading-relaxed">{analysisResult.content}</p>
              <div className="flex flex-wrap gap-3 pt-2 border-t border-white/5">
                <span className="text-xs text-gray-500">
                  Model: <span className="text-blue-300 font-mono">{analysisResult.model}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Tokens: <span className="text-gray-300">{(analysisResult.inputTokens + analysisResult.outputTokens).toLocaleString()}</span>
                </span>
                <span className="text-xs text-gray-500">
                  Cost: <span className="text-emerald-300">${analysisResult.costUsd.toFixed(4)}</span>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
