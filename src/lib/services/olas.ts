import type { OlasAgent, OlasService } from '@/types'
import { olasAgents as mockAgents, olasServices as mockServices } from '@/lib/mock-data'

const OLAS_API_URL =
  process.env.NEXT_PUBLIC_OLAS_API_URL ?? 'https://backend.autonolas.tech'

export async function fetchOlasAgents(): Promise<OlasAgent[]> {
  try {
    const res = await fetch(`${OLAS_API_URL}/api/v1/services?network=gnosis&limit=10`)
    if (!res.ok) throw new Error(`Olas error: ${res.status}`)
    const data = await res.json()
    const services: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : (data.data ?? data.services ?? [])
    return services.map((s, i) => ({
      id: String(s.id ?? `agent-${i}`),
      name: String(s.name ?? `Service ${i}`),
      description: String(s.description ?? ''),
      status: 'active' as const,
      serviceId: String(s.id ?? `svc-${i}`),
      network: s.chain_id ? 'gnosis' : 'mainnet',
      stakedAmount: '0',
      lastActive: Math.floor(Date.now() / 1000),
    }))
  } catch {
    return mockAgents
  }
}

export async function fetchOlasServices(): Promise<OlasService[]> {
  try {
    const res = await fetch(`${OLAS_API_URL}/api/v1/services?network=gnosis&limit=10`)
    if (!res.ok) throw new Error(`Olas error: ${res.status}`)
    const data = await res.json()
    const services: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : (data.data ?? data.services ?? [])
    return services.map((s, i) => ({
      id: String(s.id ?? `svc-${i}`),
      name: String(s.name ?? `Service ${i}`),
      description: String(s.description ?? ''),
      agentCount: Number(s.agent_count ?? s.agents_count ?? 1),
      state: String(s.state ?? 'DEPLOYED'),
      multisig: String(s.multisig ?? s.multisig_address ?? '0x'),
    }))
  } catch {
    return mockServices
  }
}
