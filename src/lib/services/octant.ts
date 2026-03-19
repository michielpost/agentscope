import type { OctantEpoch, OctantAllocation } from '@/types'
import { octantEpochs as mockEpochs, octantAllocations as mockAllocations } from '@/lib/mock-data'

// Octant migrated — try multiple known API URLs
const OCTANT_APIS = [
  'https://backend.production.octant.app',
  'https://octant-backend.golem.foundation',
]

async function octantFetch(path: string): Promise<Response> {
  for (const base of OCTANT_APIS) {
    try {
      const res = await fetch(`${base}${path}`, { next: { revalidate: 300 } })
      if (res.ok) return res
    } catch {
      // try next
    }
  }
  throw new Error('Octant API unreachable')
}

export async function fetchOctantEpochs(): Promise<OctantEpoch[]> {
  try {
    const res = await octantFetch('/epochs/current')
    const data = await res.json()
    const epochs: Record<string, unknown>[] = Array.isArray(data) ? data : [data]
    return epochs.map((e) => ({
      number: Number(e.epoch ?? e.number ?? 0),
      startTime: Number(e.fromTs ?? e.startTime ?? 0),
      endTime: Number(e.toTs ?? e.endTime ?? 0),
      totalRewards: String(e.totalRewards ?? '0'),
      matchedRewards: String(e.matchedRewards ?? '0'),
    }))
  } catch {
    return mockEpochs
  }
}

export async function fetchOctantAllocations(address: string): Promise<OctantAllocation[]> {
  try {
    const res = await octantFetch(`/allocations/user/${address}`)
    const data = await res.json()
    const allocations: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : (data.allocations ?? [])
    // Return empty array (not mock) when API works but user has no allocations
    return allocations.map((a) => ({
      projectName: String(a.projectName ?? a.name ?? 'Unknown Project'),
      projectAddress: String(a.projectAddress ?? a.address ?? ''),
      amount: String(a.amount ?? '0'),
      epoch: Number(a.epoch ?? 0),
      timestamp: Number(a.timestamp ?? Math.floor(Date.now() / 1000)),
    }))
  } catch {
    // API unreachable — return mock only when no wallet (caller handles this)
    return mockAllocations
  }
}
