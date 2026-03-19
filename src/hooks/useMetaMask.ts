'use client'
import { useAccount } from 'wagmi'
import { useApiData } from './useApiData'
import { fetchDelegations } from '@/lib/services/metamask'
import { delegations as mockDelegations } from '@/lib/mock-data'

export function useMetaMaskDelegations() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchDelegations(address) : Promise.resolve(mockDelegations),
    mockDelegations
  )
}
