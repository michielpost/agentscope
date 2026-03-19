// TODO: Install @metamask/delegation-framework when released
// Real integration: query ERC-7710 delegation registry on-chain
// For now, return mock data
import { delegations } from '@/lib/mock-data'

export async function fetchDelegations(_address: string) {
  return delegations
}
