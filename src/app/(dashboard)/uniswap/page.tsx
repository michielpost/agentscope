'use client'
import { ArrowLeftRight, TrendingUp, Layers, Globe } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useUniswapSwaps, useUniswapPositions } from '@/hooks/useUniswap'
import { truncateAddress, formatTimeAgo } from '@/lib/utils'

export default function UniswapPage() {
  const { data: swaps, loading: swapsLoading } = useUniswapSwaps()
  const { data: positions, loading: positionsLoading } = useUniswapPositions()

  const totalVolume = swaps.reduce((sum, s) => sum + parseFloat(s.amountIn), 0)
  const totalFees = positions.reduce((sum, p) => sum + parseFloat(p.feesEarned), 0)
  const networks = [...new Set(swaps.map((s) => s.network))].length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-pink-400">⬡</span> Uniswap
        </h2>
        <p className="text-sm text-gray-400 mt-1">Swaps and positions executed by your agent</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {swapsLoading || positionsLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="Total Volume (30d)"
              value={`$${totalVolume.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
              icon={TrendingUp}
              color="text-pink-400"
            />
            <StatCard
              title="Fees Earned"
              value={`$${totalFees.toFixed(2)}`}
              subtitle="Across all positions"
              icon={ArrowLeftRight}
              color="text-pink-400"
            />
            <StatCard
              title="Active Positions"
              value={String(positions.filter((p) => p.inRange).length)}
              subtitle={`${positions.length} total`}
              icon={Layers}
              color="text-pink-400"
            />
            <StatCard
              title="Networks"
              value={String(networks)}
              subtitle="Mainnet, Base"
              icon={Globe}
              color="text-pink-400"
            />
          </>
        )}
      </div>

      {/* Swap History */}
      <Card>
        <CardHeader>
          <CardTitle>Swap History</CardTitle>
        </CardHeader>
        <CardContent>
          {swapsLoading ? (
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
                    <th>Swap</th>
                    <th>Amount In</th>
                    <th>Amount Out</th>
                    <th>Network</th>
                    <th>Time</th>
                    <th>Tx</th>
                  </tr>
                </thead>
                <tbody>
                  {swaps.map((swap) => (
                    <tr key={swap.id}>
                      <td>
                        <span className="font-medium text-white">
                          {swap.tokenIn} → {swap.tokenOut}
                        </span>
                      </td>
                      <td>{swap.amountIn} {swap.tokenIn}</td>
                      <td>{swap.amountOut} {swap.tokenOut}</td>
                      <td>
                        <Badge variant="default">{swap.network}</Badge>
                      </td>
                      <td className="text-gray-500">{formatTimeAgo(swap.timestamp)}</td>
                      <td>
                        <span className="font-mono text-xs text-pink-400">
                          {truncateAddress(swap.txHash)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Positions */}
      <Card>
        <CardHeader>
          <CardTitle>Liquidity Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {positionsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Pool</th>
                    <th>Fee Tier</th>
                    <th>Liquidity</th>
                    <th>Status</th>
                    <th>Fees Earned</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((pos) => (
                    <tr key={pos.id}>
                      <td>
                        <span className="font-medium text-white">
                          {pos.token0} / {pos.token1}
                        </span>
                      </td>
                      <td>{(pos.feeTier / 10000).toFixed(2)}%</td>
                      <td>${parseFloat(pos.liquidity).toLocaleString()}</td>
                      <td>
                        <Badge variant={pos.inRange ? 'success' : 'warning'}>
                          {pos.inRange ? 'In Range' : 'Out of Range'}
                        </Badge>
                      </td>
                      <td className="text-emerald-400">${pos.feesEarned}</td>
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
