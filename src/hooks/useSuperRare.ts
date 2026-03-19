'use client'
import { useAccount } from 'wagmi'
import { useApiData } from './useApiData'
import { fetchSuperRareArtworks, fetchSuperRareSales } from '@/lib/services/superrare'
import { superRareArtworks as mockArtworks, superRareSales as mockSales } from '@/lib/mock-data'

export function useSuperRareArtworks() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchSuperRareArtworks(address) : Promise.resolve(mockArtworks),
    mockArtworks
  )
}

export function useSuperRareSales() {
  const { address } = useAccount()
  return useApiData(
    () => address ? fetchSuperRareSales(address) : Promise.resolve(mockSales),
    mockSales
  )
}
