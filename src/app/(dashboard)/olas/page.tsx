'use client'
import { Cpu, Server, Coins, ShoppingBag, Globe } from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { useOlasAgents, useOlasServices } from '@/hooks/useOlas'
import { truncateAddress, formatTimeAgo } from '@/lib/utils'

export default function OlasPage() {
  const { data: agents, loading: agentsLoading } = useOlasAgents()
  const { data: services, loading: servicesLoading } = useOlasServices()

  const activeCount = agents.filter((a) => a.status === 'active').length
  const deployedServices = services.filter((s) => s.state === 'DEPLOYED').length
  const totalStaked = agents.reduce((sum, a) => sum + parseFloat(a.stakedAmount), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="text-indigo-400">⬡</span> Olas
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Your agent&apos;s services on the Olas network
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
          <Globe size={10} /><div className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />Live Registry
        </div>
      </div>
      <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
        <strong>Note:</strong> Pearl desktop app integration is on the roadmap — it requires the official Pearl team integration process. Current data is sourced directly from the Olas registry API.
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {agentsLoading || servicesLoading ? (
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : (
          <>
            <StatCard
              title="Active Agents"
              value={String(activeCount)}
              subtitle={`${agents.length} total registered`}
              icon={Cpu}
              color="text-indigo-400"
            />
            <StatCard
              title="Services Running"
              value={String(deployedServices)}
              subtitle={`${services.length} total services`}
              icon={Server}
              color="text-indigo-400"
            />
            <StatCard
              title="Total Staked"
              value={`${totalStaked.toLocaleString()} OLAS`}
              subtitle="Across all agents"
              icon={Coins}
              color="text-indigo-400"
            />
            <StatCard
              title="Marketplace Items"
              value="247"
              subtitle="Services available"
              icon={ShoppingBag}
              color="text-indigo-400"
            />
          </>
        )}
      </div>

      {/* Agent Cards */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">My Agents</h3>
        {agentsLoading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{agent.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Service ID: {agent.serviceId}</p>
                  </div>
                  <Badge
                    variant={
                      agent.status === 'active'
                        ? 'success'
                        : agent.status === 'idle'
                        ? 'warning'
                        : 'danger'
                    }
                  >
                    {agent.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">{agent.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500">Network</p>
                    <p className="text-white mt-0.5">{agent.network}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Staked</p>
                    <p className="text-indigo-300 mt-0.5">{agent.stakedAmount} OLAS</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Last Active</p>
                    <p className="text-white mt-0.5">{formatTimeAgo(agent.lastActive)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent>
          {servicesLoading ? (
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
                    <th>Service</th>
                    <th>Description</th>
                    <th>Agents</th>
                    <th>State</th>
                    <th>Multisig</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((svc) => (
                    <tr key={svc.id}>
                      <td className="font-medium text-white">{svc.name}</td>
                      <td className="text-gray-400 max-w-xs">
                        <span className="line-clamp-1">{svc.description}</span>
                      </td>
                      <td>{svc.agentCount}</td>
                      <td>
                        <Badge variant={svc.state === 'DEPLOYED' ? 'success' : 'warning'}>
                          {svc.state}
                        </Badge>
                      </td>
                      <td>
                        <span className="font-mono text-xs text-indigo-400">
                          {truncateAddress(svc.multisig)}
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
