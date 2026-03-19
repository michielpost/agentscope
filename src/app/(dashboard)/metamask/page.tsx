'use client'
import { Shield, Users, Wallet, Lock, Wifi, WifiOff } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useMetaMaskDelegations } from '@/hooks/useMetaMask'
import { truncateAddress, formatDate } from '@/lib/utils'
import { useAccount } from 'wagmi'

export default function MetaMaskPage() {
  const { address, isConnected } = useAccount()
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
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-orange-400">🦊</span> Agent Permissions
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Spending limits and delegations granted to your agent via ERC-7710
          </p>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
          isConnected
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
            : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
        }`}>
          {isConnected ? (
            <><div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /><Wifi size={10} />Live · {address?.slice(0,6)}…{address?.slice(-4)}</>
          ) : (
            <><WifiOff size={10} />Mock data — connect wallet</>
          )}
        </div>
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
      ) : delegations.length === 0 ? (
        <div className="rounded-lg border border-white/5 bg-white/3 p-8 text-center">
          <Shield size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">
            {isConnected
              ? `No ERC-7710 delegations found for ${address?.slice(0,8)}…`
              : 'Connect your wallet to see your agent\'s permission grants'}
          </p>
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
