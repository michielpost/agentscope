'use client'
import { Palette, ImageIcon, TrendingUp, Percent } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useSuperRareArtworks, useSuperRareSales } from '@/hooks/useSuperRare'
import { truncateAddress, formatTimeAgo, formatDate } from '@/lib/utils'

export default function SuperRarePage() {
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
      <div>
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <span className="text-violet-400">◆</span> SuperRare / Rare Protocol
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Art created by your agent on Rare Protocol
        </p>
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
