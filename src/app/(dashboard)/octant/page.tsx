'use client'
import { Heart, Layers, Clock, Sparkles } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useOctantEpochs, useOctantAllocations } from '@/hooks/useOctant'
import { truncateAddress, formatDate } from '@/lib/utils'

export default function OctantPage() {
  const { data: epochs, loading: epochsLoading } = useOctantEpochs()
  const { data: allocations, loading: allocsLoading } = useOctantAllocations()

  const currentEpoch = epochs[0]
  const totalAllocated = allocations.reduce((sum, a) => sum + parseFloat(a.amount), 0)
  const projectsSupported = new Set(allocations.map((a) => a.projectAddress)).size

  const epochProgress = currentEpoch
    ? ((Date.now() / 1000 - currentEpoch.startTime) /
        (currentEpoch.endTime - currentEpoch.startTime)) *
      100
    : 0

  const daysRemaining = currentEpoch
    ? Math.max(0, Math.floor((currentEpoch.endTime - Date.now() / 1000) / 86400))
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-teal-400">♥</span> Octant — Public Goods Funding
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Stake GLM, earn rewards, fund the open-source ecosystem
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {epochsLoading || allocsLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Allocated"
              value={`${totalAllocated.toFixed(0)} GLM`}
              subtitle={`Epoch ${currentEpoch?.number}`}
              icon={Heart}
              color="text-teal-400"
            />
            <StatCard
              title="Current Epoch"
              value={`Epoch ${currentEpoch?.number}`}
              subtitle={`${daysRemaining} days remaining`}
              icon={Clock}
              color="text-teal-400"
            />
            <StatCard
              title="Projects Supported"
              value={String(projectsSupported)}
              subtitle="Unique grantees this epoch"
              icon={Layers}
              color="text-teal-400"
            />
            <StatCard
              title="Matched Rewards"
              value={`${parseFloat(currentEpoch?.matchedRewards ?? '0').toLocaleString()} GLM`}
              subtitle="Protocol matching bonus"
              icon={Sparkles}
              color="text-teal-400"
            />
          </>
        )}
      </div>

      {/* Epoch Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Epoch {currentEpoch?.number} Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {epochsLoading ? (
            <Skeleton className="h-20 w-full" />
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <p className="text-xs text-gray-400">Start Date</p>
                  <p className="text-sm text-white mt-0.5">{formatDate(currentEpoch?.startTime ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">End Date</p>
                  <p className="text-sm text-white mt-0.5">{formatDate(currentEpoch?.endTime ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Rewards</p>
                  <p className="text-sm text-teal-400 mt-0.5">
                    {parseFloat(currentEpoch?.totalRewards ?? '0').toLocaleString()} GLM
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Matched Rewards</p>
                  <p className="text-sm text-teal-400 mt-0.5">
                    {parseFloat(currentEpoch?.matchedRewards ?? '0').toLocaleString()} GLM
                  </p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                  <span>Epoch progress</span>
                  <span>{Math.min(epochProgress, 100).toFixed(0)}% complete · {daysRemaining}d remaining</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-teal-500 transition-all"
                    style={{ width: `${Math.min(epochProgress, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Allocations Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Allocations — Epoch {currentEpoch?.number}</CardTitle>
        </CardHeader>
        <CardContent>
          {allocsLoading ? (
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
                    <th>Project</th>
                    <th>Address</th>
                    <th>Amount</th>
                    <th>Epoch</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map((alloc, i) => (
                    <tr key={i}>
                      <td className="font-medium text-white">{alloc.projectName}</td>
                      <td>
                        <span className="font-mono text-xs text-teal-400">
                          {truncateAddress(alloc.projectAddress)}
                        </span>
                      </td>
                      <td className="text-teal-400">{alloc.amount} GLM</td>
                      <td>Epoch {alloc.epoch}</td>
                      <td className="text-gray-500">{formatDate(alloc.timestamp)}</td>
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
