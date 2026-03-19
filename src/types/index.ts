// Uniswap
export interface UniswapSwap {
  id: string
  tokenIn: string
  tokenOut: string
  amountIn: string
  amountOut: string
  timestamp: number
  txHash: string
  network: string
}

export interface UniswapPosition {
  id: string
  token0: string
  token1: string
  liquidity: string
  feeTier: number
  inRange: boolean
  feesEarned: string
}

// Celo
export interface CeloTransaction {
  hash: string
  from: string
  to: string
  value: string
  token: string
  timestamp: number
  status: 'success' | 'failed' | 'pending'
}

export interface CeloBalance {
  token: string
  symbol: string
  balance: string
  usdValue: string
}

// MetaMask Delegations
export interface Delegation {
  id: string
  delegate: string
  delegator: string
  caveats: string[]
  authority: string
  createdAt: number
  active: boolean
  spendLimit?: string
  spentSoFar?: string
}

// Bankr
export interface BankrUsage {
  date: string
  model: string
  inputTokens: number
  outputTokens: number
  costUsd: number
}

export interface BankrLimit {
  model: string
  dailyLimit: number
  used: number
  remaining: number
}

// SuperRare
export interface SuperRareArtwork {
  id: string
  title: string
  imageUrl: string
  createdAt: number
  status: 'listed' | 'sold' | 'unlisted'
  price?: string
  currency?: string
  txHash?: string
}

export interface SuperRareSale {
  id: string
  artworkTitle: string
  salePrice: string
  currency: string
  buyer: string
  timestamp: number
  txHash: string
}

// Octant
export interface OctantAllocation {
  projectName: string
  projectAddress: string
  amount: string
  epoch: number
  timestamp: number
}

export interface OctantEpoch {
  number: number
  startTime: number
  endTime: number
  totalRewards: string
  matchedRewards: string
}

// Olas
export interface OlasAgent {
  id: string
  name: string
  description: string
  status: 'active' | 'idle' | 'stopped'
  serviceId: string
  network: string
  stakedAmount: string
  lastActive: number
}

export interface OlasService {
  id: string
  name: string
  description: string
  agentCount: number
  state: string
  multisig: string
}

// Summary
export interface AgentSummary {
  totalSpendUsd: number
  activeAgents: number
  tasksInProgress: number
  alerts: number
}
