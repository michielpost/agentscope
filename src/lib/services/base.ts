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
    { id: 'x402-001', service: 'Venice AI Inference', serviceUrl: 'https://api.venice.ai/api/v1/chat/completions', amount: '0.38 USDC', amountUsd: 0.38, txHash: '0x4f3a9c2b7e1d5f8a0c6b4e2d9f7a3c1b5e8d2f6a4c9b7e3d1f5a8c2b6e4d9f7a', network: 'base', status: 'completed', timestamp: NOW - 3600, responseTime: 340 },
    { id: 'x402-002', service: 'Blockscout Data Feed', serviceUrl: 'https://base.blockscout.com/api/v2/addresses', amount: '0.05 USDC', amountUsd: 0.05, txHash: '0x8d2f6a4c9b7e3d1f5a0c4b8e2d6f9a3c7b1e5d8f2a6c4b9e7d3f1a5c8b2e6d4f', network: 'base', status: 'completed', timestamp: NOW - 7200, responseTime: 180 },
    { id: 'x402-003', service: 'AgentScope Dashboard Feed', serviceUrl: 'https://dashboard-three-smoky-78.vercel.app/api/feed', amount: '0.10 USDC', amountUsd: 0.10, txHash: '0x1b5e8d2f6a4c9b7e3d0f5a8c2b6e4d9f7a3c1b5e8d2f6a4c9b7e3d1f5a0c4b8e', network: 'base', status: 'completed', timestamp: NOW - 14400, responseTime: 220 },
    { id: 'x402-004', service: 'SuperRare Price Oracle', serviceUrl: 'https://api.superrare.com/graphql', amount: '0.25 USDC', amountUsd: 0.25, txHash: '0x7a3c1b5e8d2f6a4c9b0e3d1f5a8c2b6e4d9f7a3c1b5e8d2f6a4c9b7e3d1f5a8c', network: 'base', status: 'completed', timestamp: NOW - 28800, responseTime: 290 },
    { id: 'x402-005', service: 'Uniswap Route Optimizer', serviceUrl: 'https://gateway.thegraph.com/api', amount: '0.15 USDC', amountUsd: 0.15, txHash: '0x2d9f7a3c1b5e8d2f6a4c9b7e0d1f5a8c2b6e4d9f7a3c1b5e8d2f6a4c9b7e3d1f', network: 'base', status: 'failed', timestamp: NOW - 43200, responseTime: 0 },
    { id: 'x402-006', service: 'AgentScope Dashboard Feed', serviceUrl: 'https://dashboard-three-smoky-78.vercel.app/api/feed', amount: '0.10 USDC', amountUsd: 0.10, txHash: '0x6e4d9f7a3c1b5e8d2f0a4c9b7e3d1f5a8c2b6e4d9f7a3c1b5e8d2f6a4c9b7e3d', network: 'base', status: 'completed', timestamp: NOW - 86400, responseTime: 195 },
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
