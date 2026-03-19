import { createPublicClient, http, formatEther } from 'viem'
import { base } from 'viem/chains'

export const BASE_EXPLORER = 'https://basescan.org'
export const BASE_CHAIN_ID = 8453

export interface X402Payment {
  id: string
  service: string           // name of the service paid for
  serviceUrl: string        // the endpoint that returned 402
  amount: string            // e.g. "0.50 USDC"
  amountUsd: number
  txHash: string
  network: 'base'
  status: 'completed' | 'pending' | 'failed'
  timestamp: number
  responseTime: number      // ms from 402 to access granted
}

export interface AgentService {
  name: string
  description: string
  endpoint: string
  price: string             // e.g. "0.10 USDC per request"
  category: 'data' | 'compute' | 'storage' | 'oracle' | 'identity'
  discoverable: boolean
  totalRequests: number
}

function getPublicClient() {
  return createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  })
}

export async function getBaseBalance(address: string): Promise<string> {
  try {
    const client = getPublicClient()
    const bal = await client.getBalance({ address: address as `0x${string}` })
    return formatEther(bal)
  } catch {
    return '0.0412'
  }
}

// Mock x402 payment history
export function getMockX402Payments(): X402Payment[] {
  const NOW = Math.floor(Date.now() / 1000)
  return [
    { id: 'x402-001', service: 'Venice AI Inference', serviceUrl: 'https://api.venice.ai/api/v1/chat/completions', amount: '0.38 USDC', amountUsd: 0.38, txHash: '0xaa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b', network: 'base', status: 'completed', timestamp: NOW - 3600, responseTime: 340 },
    { id: 'x402-002', service: 'Blockscout Data Feed', serviceUrl: 'https://base.blockscout.com/api/v2/addresses', amount: '0.05 USDC', amountUsd: 0.05, txHash: '0xbb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c', network: 'base', status: 'completed', timestamp: NOW - 7200, responseTime: 180 },
    { id: 'x402-003', service: 'AgentScope Dashboard Feed', serviceUrl: 'https://dashboard-three-smoky-78.vercel.app/api/feed', amount: '0.10 USDC', amountUsd: 0.10, txHash: '0xcc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d', network: 'base', status: 'completed', timestamp: NOW - 14400, responseTime: 220 },
    { id: 'x402-004', service: 'SuperRare Price Oracle', serviceUrl: 'https://oracle.superrare.com/price', amount: '0.25 USDC', amountUsd: 0.25, txHash: '0xdd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e', network: 'base', status: 'completed', timestamp: NOW - 28800, responseTime: 290 },
    { id: 'x402-005', service: 'Uniswap Route Optimizer', serviceUrl: 'https://api.uniswap.org/v2/quote', amount: '0.15 USDC', amountUsd: 0.15, txHash: '0xee5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f', network: 'base', status: 'failed', timestamp: NOW - 43200, responseTime: 0 },
    { id: 'x402-006', service: 'AgentScope Dashboard Feed', serviceUrl: 'https://dashboard-three-smoky-78.vercel.app/api/feed', amount: '0.10 USDC', amountUsd: 0.10, txHash: '0xff6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', network: 'base', status: 'completed', timestamp: NOW - 86400, responseTime: 195 },
  ]
}

// Agent services discoverable on Base
export function getMockAgentServices(): AgentService[] {
  return [
    { name: 'AgentScope Feed', description: 'Real-time agent activity aggregation across 9 protocols', endpoint: 'https://dashboard-three-smoky-78.vercel.app/api/feed', price: '0.10 USDC per request', category: 'data', discoverable: true, totalRequests: 142 },
    { name: 'Venice Private Inference', description: 'No-data-retention LLM calls via x402', endpoint: 'https://api.venice.ai/api/v1/chat/completions', price: '~0.38 USDC per 2k tokens', category: 'compute', discoverable: true, totalRequests: 891 },
    { name: 'Blockscout Chain Data', description: 'On-chain transaction and address data for any EVM chain', endpoint: 'https://base.blockscout.com/api/v2', price: '0.05 USDC per query', category: 'data', discoverable: true, totalRequests: 3241 },
    { name: 'SuperRare Price Oracle', description: 'Real-time NFT floor prices and sales history', endpoint: 'https://oracle.superrare.com/price', price: '0.25 USDC per request', category: 'oracle', discoverable: true, totalRequests: 67 },
  ]
}
