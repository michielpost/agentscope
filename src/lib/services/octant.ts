import type { OctantEpoch, OctantAllocation } from '@/types'
import { octantEpochs as mockEpochs, octantAllocations as mockAllocations } from '@/lib/mock-data'

const OCTANT_API_URL =
  process.env.NEXT_PUBLIC_OCTANT_API_URL ?? 'https://backend.production.octant.app'

export async function fetchOctantEpochs(): Promise<OctantEpoch[]> {
  try {
    const res = await fetch(`${OCTANT_API_URL}/epochs`)
    if (!res.ok) throw new Error(`Octant error: ${res.status}`)
    const data = await res.json()
    const epochs: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : (data.epochs ?? [])
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
    const res = await fetch(`${OCTANT_API_URL}/allocations/user/${address}`)
    if (!res.ok) throw new Error(`Octant error: ${res.status}`)
    const data = await res.json()
    const allocations: Record<string, unknown>[] = Array.isArray(data)
      ? data
      : (data.allocations ?? [])
    return allocations.map((a) => ({
      projectName: String(a.projectName ?? a.name ?? ''),
      projectAddress: String(a.projectAddress ?? a.address ?? ''),
      amount: String(a.amount ?? '0'),
      epoch: Number(a.epoch ?? 0),
      timestamp: Number(a.timestamp ?? Math.floor(Date.now() / 1000)),
    }))
  } catch {
    return mockAllocations
  }
}
