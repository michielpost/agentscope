'use client'
import { Shield, Users, Wallet, Lock } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMetaMaskDelegations } from '@/hooks/useMetaMask'
import { truncateAddress, formatDate } from '@/lib/utils'

export default function MetaMaskPage() {
  const { data: delegations, loading } = useMetaMaskDelegations()

  const activeDelegations = delegations.filter((d) => d.active)
  const totalSpendLimit = delegations
    .filter((d) => d.active && d.spendLimit)
    .reduce((sum, d) => sum + parseFloat(d.spendLimit ?? '0'), 0)
  const totalSpent = delegations
    .filter((d) => d.active && d.spentSoFar)
    .reduce((sum, d) => sum + parseFloat(d.spentSoFar ?? '0'), 0)
  const totalCaveats = delegations.reduce((sum, d) => sum + d.caveats.length, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-orange-400">🦊</span> MetaMask Delegation Framework
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          ERC-7710/7715 — grant and manage agent spending authority
        </p>
      </div>

      {/* Live data banner */}
      <div className="rounded-lg border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-sm text-orange-300">
        Live delegation data requires MetaMask Delegation Framework SDK (ERC-7710). Currently showing demo data.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="Active Delegations"
              value={String(activeDelegations.length)}
              subtitle={`${delegations.length} total`}
              icon={Users}
              color="text-orange-400"
            />
            <StatCard
              title="Total Spend Limit"
              value={`${totalSpendLimit.toFixed(2)} ETH`}
              subtitle="Across active delegations"
              icon={Wallet}
              color="text-orange-400"
            />
            <StatCard
              title="Spent So Far"
              value={`${totalSpent.toFixed(2)} ETH`}
              subtitle={`${totalSpendLimit > 0 ? ((totalSpent / totalSpendLimit) * 100).toFixed(0) : 0}% of limit`}
              icon={Shield}
              color="text-orange-400"
            />
            <StatCard
              title="Caveats Active"
              value={String(totalCaveats)}
              subtitle="Across all delegations"
              icon={Lock}
              color="text-orange-400"
            />
          </>
        )}
      </div>

      {/* Delegation Cards */}
      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {delegations.map((del) => {
            const spendPct =
              del.spendLimit && del.spentSoFar
                ? (parseFloat(del.spentSoFar) / parseFloat(del.spendLimit)) * 100
                : 0

            return (
              <Card key={del.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Delegate</p>
                      <p className="font-mono text-sm text-orange-300">
                        {truncateAddress(del.delegate)}
                      </p>
                    </div>
                    <Badge variant={del.active ? 'success' : 'default'}>
                      {del.active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Caveats */}
                    <div>
                      <p className="text-xs text-gray-500 mb-1.5">Caveats</p>
                      <div className="space-y-1">
                        {del.caveats.map((c, i) => (
                          <p key={i} className="text-xs text-gray-300 bg-white/5 rounded px-2 py-1 font-mono">
                            {c}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Spend limit progress */}
                    {del.spendLimit && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Spend limit</span>
                          <span>{del.spentSoFar} / {del.spendLimit} ETH</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/10">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              spendPct >= 90
                                ? 'bg-red-500'
                                : spendPct >= 70
                                ? 'bg-amber-500'
                                : 'bg-orange-400'
                            }`}
                            style={{ width: `${Math.min(spendPct, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-xs text-gray-600">
                      Created {formatDate(del.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
