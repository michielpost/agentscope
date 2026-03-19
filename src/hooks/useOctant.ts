'use client'
import { useAccount } from 'wagmi'
import { useApiData } from './useApiData'
import { fetchOctantEpochs, fetchOctantAllocations } from '@/lib/services/octant'
import { octantEpochs as mockEpochs, octantAllocations as mockAllocations } from '@/lib/mock-data'

export function useOctantEpochs() {
  return useApiData(() => fetchOctantEpochs(), mockEpochs)
}

export function useOctantAllocations() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchOctantAllocations(address) : Promise.resolve(mockAllocations),
    mockAllocations,
    [address]
  )
}
