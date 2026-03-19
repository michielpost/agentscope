import { createPublicClient, http, defineChain } from 'viem'

export const AGENT_ACTIVITY_LOG_ADDRESS = '0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348' as const
export const CELO_SEPOLIA_CHAIN_ID = 11142220
export const CELO_SEPOLIA_RPC = 'https://forno.celo-sepolia.celo-testnet.org'
export const CELO_SEPOLIA_EXPLORER = 'https://celo-sepolia.blockscout.com'
export const DEPLOY_TX = '0x8ab06a75e0d6d84025c07cc4ff7553e8cb0df49b56aa64b57b5ed6e53c738ff6'

const celoSepolia = defineChain({
  id: CELO_SEPOLIA_CHAIN_ID,
  name: 'Celo Sepolia Testnet',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: { default: { http: [CELO_SEPOLIA_RPC] } },
  blockExplorers: { default: { name: 'Blockscout', url: CELO_SEPOLIA_EXPLORER } },
  testnet: true,
})

export const AGENT_ACTIVITY_LOG_ABI = [
  {
    type: 'event',
    name: 'AgentRegistered',
    inputs: [
      { name: 'agentAddress', type: 'address', indexed: true },
      { name: 'name', type: 'string', indexed: false },
      { name: 'agentType', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'ActivityLogged',
    inputs: [
      { name: 'agentAddress', type: 'address', indexed: true },
      { name: 'protocol', type: 'string', indexed: false },
      { name: 'action', type: 'string', indexed: false },
      { name: 'description', type: 'string', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'function',
    name: 'registerAgent',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'agentType', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'logActivity',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'protocol', type: 'string' },
      { name: 'action', type: 'string' },
      { name: 'description', type: 'string' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'getAgentInfo',
    stateMutability: 'view',
    inputs: [{ name: 'agentAddress', type: 'address' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'agentAddress', type: 'address' },
          { name: 'name', type: 'string' },
          { name: 'agentType', type: 'string' },
          { name: 'registeredAt', type: 'uint256' },
          { name: 'activityCount', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getAgentActivities',
    stateMutability: 'view',
    inputs: [
      { name: 'agentAddress', type: 'address' },
      { name: 'offset', type: 'uint256' },
      { name: 'limit', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'agentAddress', type: 'address' },
          { name: 'protocol', type: 'string' },
          { name: 'action', type: 'string' },
          { name: 'description', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
  },
  {
    type: 'function',
    name: 'getTotalAgents',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'getTotalActivities',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

export interface ContractStats {
  totalAgents: number
  totalActivities: number
}

export interface OnChainActivity {
  agentAddress: string
  protocol: string
  action: string
  description: string
  timestamp: number
  transactionHash: string
  blockNumber: bigint
}

function getClient() {
  return createPublicClient({
    chain: celoSepolia,
    transport: http(CELO_SEPOLIA_RPC),
  })
}

export async function getContractStats(): Promise<ContractStats> {
  const client = getClient()
  const [totalAgents, totalActivities] = await Promise.all([
    client.readContract({
      address: AGENT_ACTIVITY_LOG_ADDRESS,
      abi: AGENT_ACTIVITY_LOG_ABI,
      functionName: 'getTotalAgents',
    }),
    client.readContract({
      address: AGENT_ACTIVITY_LOG_ADDRESS,
      abi: AGENT_ACTIVITY_LOG_ABI,
      functionName: 'getTotalActivities',
    }),
  ])
  return {
    totalAgents: Number(totalAgents),
    totalActivities: Number(totalActivities),
  }
}

export async function getRecentActivities(limit = 10): Promise<OnChainActivity[]> {
  const client = getClient()
  const latestBlock = await client.getBlockNumber()
  const fromBlock = latestBlock > BigInt(1000) ? latestBlock - BigInt(1000) : BigInt(0)

  const logs = await client.getLogs({
    address: AGENT_ACTIVITY_LOG_ADDRESS,
    event: AGENT_ACTIVITY_LOG_ABI[1], // ActivityLogged event
    fromBlock,
    toBlock: latestBlock,
  })

  return logs
    .slice(-limit)
    .reverse()
    .map((log) => ({
      agentAddress: log.args.agentAddress as string,
      protocol: log.args.protocol as string,
      action: log.args.action as string,
      description: log.args.description as string,
      timestamp: Number(log.args.timestamp ?? 0),
      transactionHash: log.transactionHash ?? '',
      blockNumber: log.blockNumber ?? BigInt(0),
    }))
}
