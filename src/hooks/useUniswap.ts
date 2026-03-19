'use client'
import { useAccount } from 'wagmi'
import { useApiData } from './useApiData'
import { fetchUniswapSwaps, fetchUniswapPositions } from '@/lib/services/uniswap'
import { uniswapSwaps as mockSwaps, uniswapPositions as mockPositions } from '@/lib/mock-data'

export function useUniswapSwaps() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchUniswapSwaps(address) : Promise.resolve(mockSwaps),
    mockSwaps
  )
}

export function useUniswapPositions() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchUniswapPositions(address) : Promise.resolve(mockPositions),
    mockPositions
  )
}
