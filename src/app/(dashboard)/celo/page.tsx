'use client'
import { Coins, ArrowUpDown, Clock, ExternalLink, Activity } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCeloBalances, useCeloTransactions } from '@/hooks/useCelo'
import { truncateAddress, formatTimeAgo } from '@/lib/utils'
import { useApiData } from '@/hooks/useApiData'
import {
  getContractStats,
  getRecentActivities,
  AGENT_ACTIVITY_LOG_ADDRESS,
  CELO_SEPOLIA_EXPLORER,
  DEPLOY_TX,
  type ContractStats,
  type OnChainActivity,
} from '@/lib/services/agentActivityLog'

const defaultStats: ContractStats = { totalAgents: 0, totalActivities: 0 }
const defaultActivities: OnChainActivity[] = []

export default function CeloPage() {
  const { data: balances, loading: balancesLoading } = useCeloBalances()
  const { data: transactions, loading: txLoading } = useCeloTransactions()
  const { data: contractStats, loading: statsLoading } = useApiData(
    () => getContractStats(),
    defaultStats
  )
  const { data: recentActivities, loading: activitiesLoading } = useApiData(
    () => getRecentActivities(10),
    defaultActivities
  )

  const celoBalance = balances.find((b) => b.symbol === 'CELO')
  const cusdBalance = balances.find((b) => b.symbol === 'cUSD')
  const lastActivity = transactions.length
    ? Math.max(...transactions.map((t) => t.timestamp))
    : 0

  const contractAddressUrl = `${CELO_SEPOLIA_EXPLORER}/address/${AGENT_ACTIVITY_LOG_ADDRESS}`
  const deployTxUrl = `${CELO_SEPOLIA_EXPLORER}/tx/${DEPLOY_TX}`

  return (
    <div className="space-y-6">
      {/* On-Chain Agent Activity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-green-400" />
            On-Chain Agent Activity
          </CardTitle>
          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 border border-green-500/20">
            Celo Sepolia Testnet
          </span>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract info row */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Contract:</span>
              <a
                href={contractAddressUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-green-400 hover:text-green-300 flex items-center gap-1"
              >
                {truncateAddress(AGENT_ACTIVITY_LOG_ADDRESS)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Deploy tx:</span>
              <a
                href={deployTxUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-slate-300 hover:text-white flex items-center gap-1 text-xs"
              >
                {truncateAddress(DEPLOY_TX)}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Registered Agents</p>
              {statsLoading ? (
                <Skeleton className="mt-1 h-7 w-16" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-white">{contractStats.totalAgents}</p>
              )}
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs text-slate-400">Total Activities</p>
              {statsLoading ? (
                <Skeleton className="mt-1 h-7 w-16" />
              ) : (
                <p className="mt-1 text-2xl font-bold text-white">{contractStats.totalActivities}</p>
              )}
            </div>
          </div>

          {/* Recent on-chain events */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Recent Events
            </p>
            {activitiesLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-sm text-slate-500">No activity events found in last 1000 blocks.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="pb-2 text-left text-xs font-medium text-slate-400">Agent</th>
                      <th className="pb-2 text-left text-xs font-medium text-slate-400">Protocol</th>
                      <th className="pb-2 text-left text-xs font-medium text-slate-400">Action</th>
                      <th className="pb-2 text-left text-xs font-medium text-slate-400">Description</th>
                      <th className="pb-2 text-left text-xs font-medium text-slate-400">Tx</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentActivities.map((ev, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-2 pr-4 font-mono text-xs text-green-400">
                          {truncateAddress(ev.agentAddress)}
                        </td>
                        <td className="py-2 pr-4 text-slate-300">{ev.protocol}</td>
                        <td className="py-2 pr-4 text-slate-300">{ev.action}</td>
                        <td className="py-2 pr-4 text-slate-400 max-w-xs truncate">{ev.description}</td>
                        <td className="py-2">
                          {ev.transactionHash ? (
                            <a
                              href={`${CELO_SEPOLIA_EXPLORER}/tx/${ev.transactionHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-xs text-slate-400 hover:text-white flex items-center gap-1"
                            >
                              {truncateAddress(ev.transactionHash)}
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-green-400">◉</span> Celo
        </h2>
        <p className="text-sm text-gray-400 mt-1">Transactions sent by your agent on Celo</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {balancesLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="CELO Balance"
              value={`${parseFloat(celoBalance?.balance ?? '0').toLocaleString()} CELO`}
              subtitle={`≈ $${celoBalance?.usdValue}`}
              icon={Coins}
              color="text-green-400"
            />
            <StatCard
              title="cUSD Balance"
              value={`${parseFloat(cusdBalance?.balance ?? '0').toLocaleString()} cUSD`}
              subtitle="Celo Dollar stablecoin"
              icon={Coins}
              color="text-green-400"
            />
            <StatCard
              title="Transactions"
              value={String(transactions.length)}
              subtitle="Last 30 days"
              icon={ArrowUpDown}
              color="text-green-400"
            />
            <StatCard
              title="Last Activity"
              value={lastActivity ? formatTimeAgo(lastActivity) : '—'}
              icon={Clock}
              color="text-green-400"
            />
          </>
        )}
      </div>

      {/* Token Balances */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {balancesLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))
          : balances.map((b) => (
              <div
                key={b.symbol}
                className="rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <p className="text-xs text-gray-400">{b.token}</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {parseFloat(b.balance).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">{b.symbol}</p>
                <p className="mt-2 text-xs text-emerald-400">≈ ${parseFloat(b.usdValue).toLocaleString()}</p>
              </div>
            ))}
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {txLoading ? (
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
                    <th>Hash</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Amount</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.hash}>
                      <td>
                        <span className="font-mono text-xs text-green-400">
                          {truncateAddress(tx.hash)}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono text-xs">
                          {truncateAddress(tx.from)}
                        </span>
                      </td>
                      <td>
                        <span className="font-mono text-xs">
                          {truncateAddress(tx.to)}
                        </span>
                      </td>
                      <td className="font-medium text-white">
                        {tx.value} {tx.token}
                      </td>
                      <td className="text-gray-500">{formatTimeAgo(tx.timestamp)}</td>
                      <td>
                        <Badge
                          variant={
                            tx.status === 'success'
                              ? 'success'
                              : tx.status === 'pending'
                              ? 'warning'
                              : 'danger'
                          }
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
