import { ExternalLink, Clock, CheckCircle2, Layers } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ArbitrumPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Arbitrum</h1>
            <Badge variant="warning" className="flex items-center gap-1">
              <Clock size={11} /> Coming Soon
            </Badge>
          </div>
          <p className="text-sm text-gray-400">Agent activity on Arbitrum One — settlement receipts, escrow contracts, DeFi</p>
        </div>
      </div>

      {/* Settlement receipts highlight */}
      <Card className="border-cyan-500/20 bg-cyan-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-cyan-300">
            <CheckCircle2 size={18} className="text-cyan-400" />
            Primary Use Case: Settlement Receipts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-300">
            Arbitrum is where agent-to-agent economic contracts live. Track the full lifecycle of verified work payments: escrow creation, work proof submission, and settlement approval — all with on-chain cryptographic receipts.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {[
              { event: 'PactCreated', desc: 'Tokens locked in escrow, work terms defined', color: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-300' },
              { event: 'WorkSubmitted', desc: 'SHA256 delivery hash committed on-chain', color: 'border-blue-500/30 bg-blue-500/5 text-blue-300' },
              { event: 'PactApproved', desc: 'Payment released, settlement complete', color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300' },
            ].map((e) => (
              <div key={e.event} className={`rounded-lg border p-3 ${e.color.split(' ').slice(0, 2).join(' ')}`}>
                <p className={`text-xs font-mono font-semibold mb-1 ${e.color.split(' ')[2]}`}>{e.event}</p>
                <p className="text-xs text-gray-400">{e.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers size={18} className="text-sky-400" />
            Network Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { label: 'Network', value: 'Arbitrum One' },
              { label: 'Chain ID', value: '42161' },
              { label: 'Native Token', value: 'ETH' },
              { label: 'Explorer', value: 'arbiscan.io', link: 'https://arbiscan.io' },
              { label: 'Indexer', value: 'Blockscout (Arbitrum)', link: 'https://arbitrum.blockscout.com' },
              { label: 'The Graph', value: 'Sparse for custom contracts — Blockscout preferred' },
            ].map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <span className="text-xs text-gray-500 uppercase tracking-wider">{row.label}</span>
                {row.link ? (
                  <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-sm">
                    {row.value} <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="text-gray-200">{row.value}</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Planned integrations */}
      <Card>
        <CardHeader><CardTitle>Planned Integrations</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Settlement Receipts', desc: 'Track PactCreated/WorkSubmitted/PactApproved events from escrow contracts', priority: 'P1' },
              { name: 'Blockscout Transaction Feed', desc: 'Agent wallet transactions via Blockscout Arbitrum API', priority: 'P1' },
              { name: 'Uniswap v3 on Arbitrum', desc: 'Swap history from The Graph Arbitrum subgraph', priority: 'P2' },
              { name: 'GMX / Perp DEX activity', desc: 'Agent trading on perpetuals protocols', priority: 'P3' },
            ].map((item) => (
              <div key={item.name} className="flex items-start gap-3 rounded-lg border border-white/5 bg-white/[0.03] p-3">
                <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-mono font-bold ${item.priority === 'P1' ? 'bg-blue-500/20 text-blue-400' : item.priority === 'P2' ? 'bg-gray-500/20 text-gray-400' : 'bg-white/5 text-gray-600'}`}>{item.priority}</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
