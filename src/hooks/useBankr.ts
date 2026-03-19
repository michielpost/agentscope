'use client'
import { useApiData } from './useApiData'
import { fetchBankrUsage, fetchBankrLimits } from '@/lib/services/bankr'
import { bankrUsage as mockUsage, bankrLimits as mockLimits } from '@/lib/mock-data'

export function useBankrUsage() {
  return useApiData(() => fetchBankrUsage(), mockUsage)
}

export function useBankrLimits() {
  return useApiData(() => fetchBankrLimits(), mockLimits)
}
