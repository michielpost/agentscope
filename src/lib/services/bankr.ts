// TODO: Add BANKR_API_KEY to .env.local to enable live data
// Real integration: GET /v1/usage, GET /v1/limits
// For now, return mock data
import { bankrUsage, bankrLimits } from '@/lib/mock-data'

export async function fetchBankrUsage() {
  return bankrUsage
}

export async function fetchBankrLimits() {
  return bankrLimits
}
