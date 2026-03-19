'use client'
import { Palette, ImageIcon, TrendingUp, Percent, Wifi, WifiOff } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSuperRareArtworks, useSuperRareSales } from '@/hooks/useSuperRare'
import { truncateAddress, formatTimeAgo, formatDate } from '@/lib/utils'
import { useAccount } from 'wagmi'

export default function SuperRarePage() {
  const { address, isConnected } = useAccount()
  const { data: artworks, loading: artworksLoading } = useSuperRareArtworks()
  const { data: sales, loading: salesLoading } = useSuperRareSales()

  const totalSalesVolume = sales.reduce((sum, s) => sum + parseFloat(s.salePrice), 0)
  const listedArtworks = artworks.filter((a) => a.status === 'listed')
  const floorPrice = listedArtworks.length
    ? Math.min(...listedArtworks.map((a) => parseFloat(a.price ?? '0')))
    : 0
  const royaltiesEarned = (totalSalesVolume * 0.1).toFixed(2)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-violet-400">◆</span> SuperRare / Rare Protocol
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Art created by your agent on Rare Protocol
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
        {artworksLoading || salesLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="Artworks Created"
              value={String(artworks.length)}
              subtitle={`${listedArtworks.length} currently listed`}
              icon={ImageIcon}
              color="text-violet-400"
            />
            <StatCard
              title="Total Sales Volume"
              value={`${totalSalesVolume.toFixed(2)} ETH`}
              subtitle={`${sales.length} sales`}
              icon={TrendingUp}
              color="text-violet-400"
            />
            <StatCard
              title="Floor Price"
              value={`${floorPrice} ETH`}
              subtitle="Lowest listed price"
              icon={Palette}
              color="text-violet-400"
            />
            <StatCard
              title="Royalties Earned"
              value={`${royaltiesEarned} ETH`}
              subtitle="10% on secondary sales"
              icon={Percent}
              color="text-violet-400"
            />
          </>
        )}
      </div>

      {/* Artwork Grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Artworks</h3>
        {artworksLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="rounded-lg border border-white/5 bg-white/3 p-8 text-center">
            <Palette size={32} className="text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">
              {isConnected
                ? `No artworks found for ${address?.slice(0,8)}… on SuperRare`
                : 'Connect wallet to see your agent\'s artworks'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {artworks.map((art) => (
              <div
                key={art.id}
                className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
              >
                {/* Image placeholder */}
                <div className="aspect-square bg-gradient-to-br from-violet-900/40 to-purple-900/40 flex items-center justify-center">
                  <Palette size={40} className="text-violet-400/40" />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-white truncate">{art.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{formatDate(art.createdAt)}</p>
                  <div className="flex items-center justify-between mt-2">
                    <Badge
                      variant={
                        art.status === 'listed'
                          ? 'info'
                          : art.status === 'sold'
                          ? 'success'
                          : 'default'
                      }
                    >
                      {art.status}
                    </Badge>
                    {art.price && (
                      <span className="text-xs text-violet-300 font-medium">
                        {art.price} {art.currency}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sales History */}
      <Card>
        <CardHeader>
          <CardTitle>Sales History</CardTitle>
        </CardHeader>
        <CardContent>
          {salesLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Artwork</th>
                    <th>Sale Price</th>
                    <th>Buyer</th>
                    <th>Date</th>
                    <th>Tx</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="font-medium text-white">{sale.artworkTitle}</td>
                      <td className="text-emerald-400">
                        {sale.salePrice} {sale.currency}
                      </td>
                      <td>
                        <span className="font-mono text-xs">{truncateAddress(sale.buyer)}</span>
                      </td>
                      <td className="text-gray-500">{formatTimeAgo(sale.timestamp)}</td>
                      <td>
                        <span className="font-mono text-xs text-violet-400">
                          {truncateAddress(sale.txHash)}
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
    </div>
  )
}
