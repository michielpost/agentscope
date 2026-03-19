'use client'
import { Coins, ArrowUpDown, Clock } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useCeloBalances, useCeloTransactions } from '@/hooks/useCelo'
import { truncateAddress, formatTimeAgo } from '@/lib/utils'

export default function CeloPage() {
  const { data: balances, loading: balancesLoading } = useCeloBalances()
  const { data: transactions, loading: txLoading } = useCeloTransactions()

  const celoBalance = balances.find((b) => b.symbol === 'CELO')
  const cusdBalance = balances.find((b) => b.symbol === 'cUSD')
  const lastActivity = transactions.length
    ? Math.max(...transactions.map((t) => t.timestamp))
    : 0

  return (
    <div className="space-y-6">
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
