'use client'
import { useAccount } from 'wagmi'
import { useApiData } from './useApiData'
import { fetchCeloBalances, fetchCeloTransactions } from '@/lib/services/celo'
import { celoBalances as mockBalances, celoTransactions as mockTxs } from '@/lib/mock-data'

export function useCeloBalances() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchCeloBalances(address) : Promise.resolve(mockBalances),
    mockBalances
  )
}

export function useCeloTransactions() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchCeloTransactions(address) : Promise.resolve(mockTxs),
    mockTxs
  )
}
