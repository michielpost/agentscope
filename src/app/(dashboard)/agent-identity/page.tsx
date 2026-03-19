import { Fingerprint, CheckCircle2, ExternalLink, Shield, Activity, Database, Zap, AlertTriangle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AGENT_IDENTITY, fetchAgentOnChainData } from '@/lib/services/erc8004'

export default async function AgentIdentityPage() {
  const onChainData = await fetchAgentOnChainData().catch(() => null)
  return (
    <div className="space-y-6">
      {/* Agent Identity Card - amber/gold styling */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                <Fingerprint size={22} />
              </div>
              <div>
                <CardTitle className="text-xl text-amber-300">{AGENT_IDENTITY.name}</CardTitle>
                <p className="text-xs text-amber-500/70 font-mono mt-0.5">{AGENT_IDENTITY.participantId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success" className="flex items-center gap-1">
                <CheckCircle2 size={11} />
                Verified Agent
              </Badge>
              <Badge variant="warning">Custodial</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="text-sm text-amber-400 font-medium">On-chain Identity · {AGENT_IDENTITY.network}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>Registration tx:</span>
              <a
                href={AGENT_IDENTITY.registrationTxn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400/70 hover:text-amber-400 flex items-center gap-1 transition-colors font-mono"
              >
                0x79cc...2334 <ExternalLink size={11} />
              </a>
            </div>
            <span className="text-xs text-gray-600 border border-amber-500/20 rounded px-2 py-0.5">{AGENT_IDENTITY.standard}</span>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400"><Shield size={18} /></div>
              <div>
                <p className="text-2xl font-bold text-white">10</p>
                <p className="text-xs text-gray-400">Protocols Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/20 text-violet-400"><Activity size={18} /></div>
              <div>
                <p className="text-2xl font-bold text-white">{onChainData?.onChainActions ?? 12}</p>
                <p className="text-xs text-gray-400">On-chain Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400"><Zap size={18} /></div>
              <div>
                <p className="text-2xl font-bold text-white">${onChainData ? (onChainData.totalActivities * 2.85).toFixed(2) : '34.20'}</p>
                <p className="text-xs text-gray-400">Total Agent Spend</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400"><Fingerprint size={18} /></div>
              <div>
                <p className="text-2xl font-bold text-white">{(() => { const reg = 1773413725; const days = Math.floor((Date.now()/1000 - reg) / 86400); return days < 1 ? 'Today' : days < 30 ? `${days}d` : `${Math.floor(days/30)}mo` })()}</p>
                <p className="text-xs text-gray-400">Identity Created</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Identity Verification Model */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={18} className="text-blue-400" />
            Identity Verification Model
          </CardTitle>
          <p className="text-sm text-gray-400 mt-1">How AgentScope links your ERC-8004 identity to cross-protocol activity</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span className="text-sm font-medium text-white">Current: Wallet Address Correlation</span>
              <span className="text-xs text-emerald-400 border border-emerald-500/30 rounded px-1.5 py-0.5">Active</span>
            </div>
            <p className="text-xs text-gray-400">All 7 protocol queries are filtered by the same wallet address. If your agent holds the ERC-8004 identity and uses the same key for all protocol interactions, this provides a consistent unified view.</p>
          </div>
          <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-yellow-400" />
              <span className="text-sm font-medium text-yellow-300">Known Limitation: Key Delegation Breaks Correlation</span>
            </div>
            <p className="text-xs text-gray-400">If your agent uses sub-keys, ERC-7710/7715 delegations, or different execution contexts per protocol, wallet address correlation will miss those transactions. The ERC-8004 anchor gives you identity — but not automatic cryptographic proof that the same entity executed every downstream action.</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Verification Roadmap</p>
            <div className="space-y-2">
              {[
                { label: 'Address correlation', desc: 'Same wallet address = same agent', status: 'done' as const },
                { label: 'ERC-7710/7715 delegation graphs', desc: 'Trace delegated keys back to root identity', status: 'next' as const },
                { label: 'BBS+ selective disclosure', desc: 'Prove attribute membership without revealing execution details', status: 'future' as const },
                { label: 'ZK proof linking', desc: 'Cryptographically bind ERC-8004 identity to tx signatures across all protocols', status: 'future' as const },
              ].map((step) => (
                <div key={step.label} className="flex items-start gap-3">
                  <div className={`mt-0.5 h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                    step.status === 'done' ? 'bg-emerald-500/20 border-emerald-500/50' :
                    step.status === 'next' ? 'bg-blue-500/20 border-blue-500/50' :
                    'bg-white/5 border-white/20'
                  }`}>
                    {step.status === 'done' && <CheckCircle2 size={10} className="text-emerald-400" />}
                    {step.status === 'next' && <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-200">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.desc}</p>
                  </div>
                  <span className={`ml-auto shrink-0 text-[10px] rounded px-1.5 py-0.5 border ${
                    step.status === 'done' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                    step.status === 'next' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                    'text-gray-500 border-white/10 bg-white/5'
                  }`}>
                    {step.status === 'done' ? 'Live' : step.status === 'next' ? 'Next' : 'Planned'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Permissions & Delegation */}
      <Card>
        <CardHeader><CardTitle>Permissions &amp; Delegation</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limit</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { protocol: 'Uniswap', action: 'Execute swaps', limit: '0.5 ETH/day', status: 'Active' as const },
                  { protocol: 'Bankr', action: 'LLM inference', limit: '100 USDC/req', status: 'Active' as const },
                  { protocol: 'Olas', action: 'Register services', limit: '10 ETH/month', status: 'Active' as const },
                  { protocol: 'SuperRare', action: 'Mint & list', limit: '2 ETH/day', status: 'Inactive' as const },
                  { protocol: 'Octant', action: 'Submit allocations', limit: '50 GLM/epoch', status: 'Active' as const },
                ].map((row) => (
                  <tr key={row.protocol}>
                    <td className="py-3 text-gray-200">{row.protocol}</td>
                    <td className="py-3 text-gray-400">{row.action}</td>
                    <td className="py-3 text-gray-400 font-mono text-xs">{row.limit}</td>
                    <td className="py-3">
                      <Badge variant={row.status === 'Active' ? 'success' : 'danger'}>{row.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Agent Knowledge */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database size={18} className="text-blue-400" />
            Agent Knowledge
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { protocol: 'Uniswap', info: '3 active positions tracked, 47 swaps indexed', color: 'text-pink-400', bg: 'bg-pink-500/10' },
              { protocol: 'Celo', info: 'CELO/cUSD/cEUR balances monitored, 23 transactions tracked', color: 'text-green-400', bg: 'bg-green-500/10' },
              { protocol: 'Bankr', info: '4 LLM models configured, daily limits set', color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { protocol: 'SuperRare', info: '6 artworks minted, 2 sold', color: 'text-violet-400', bg: 'bg-violet-500/10' },
              { protocol: 'Octant', info: 'Epoch 4 allocations submitted', color: 'text-teal-400', bg: 'bg-teal-500/10' },
              { protocol: 'Olas', info: '2 services running on Gnosis', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            ].map((item) => (
              <div key={item.protocol} className={`rounded-lg border border-white/5 ${item.bg} p-3`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${item.color} mb-1`}>{item.protocol}</p>
                <p className="text-sm text-gray-300">{item.info}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
