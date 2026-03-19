import type {
  UniswapSwap,
  UniswapPosition,
  CeloTransaction,
  CeloBalance,
  Delegation,
  BankrUsage,
  BankrLimit,
  SuperRareArtwork,
  SuperRareSale,
  OctantAllocation,
  OctantEpoch,
  OlasAgent,
  OlasService,
  AgentSummary,
} from '@/types'

// Base timestamp: ~June 2025
const NOW = Math.floor(Date.now() / 1000)

export const uniswapSwaps: UniswapSwap[] = [
  {
    id: 'swap-001',
    tokenIn: 'USDC',
    tokenOut: 'ETH',
    amountIn: '2500.00',
    amountOut: '0.9823',
    timestamp: NOW - 3600,
    txHash: '0x3a7d4f8e2b1c9056ab3e7f2d4c8a1b5e9f3c2d7a6b4e8f1c5d9a3b7e2f6c4d8',
    network: 'mainnet',
  },
  {
    id: 'swap-002',
    tokenIn: 'ETH',
    tokenOut: 'WBTC',
    amountIn: '1.5000',
    amountOut: '0.0387',
    timestamp: NOW - 14400,
    txHash: '0xf1c2d3e4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2',
    network: 'mainnet',
  },
  {
    id: 'swap-003',
    tokenIn: 'USDC',
    tokenOut: 'cbBTC',
    amountIn: '5000.00',
    amountOut: '0.0521',
    timestamp: NOW - 86400,
    txHash: '0x7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    network: 'base',
  },
  {
    id: 'swap-004',
    tokenIn: 'DAI',
    tokenOut: 'USDC',
    amountIn: '10000.00',
    amountOut: '9997.43',
    timestamp: NOW - 172800,
    txHash: '0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    network: 'mainnet',
  },
  {
    id: 'swap-005',
    tokenIn: 'WETH',
    tokenOut: 'OP',
    amountIn: '0.7500',
    amountOut: '1234.56',
    timestamp: NOW - 259200,
    txHash: '0x9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    network: 'base',
  },
  {
    id: 'swap-006',
    tokenIn: 'USDC',
    tokenOut: 'ETH',
    amountIn: '3750.00',
    amountOut: '1.4712',
    timestamp: NOW - 432000,
    txHash: '0x4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
    network: 'mainnet',
  },
]

export const uniswapPositions: UniswapPosition[] = [
  {
    id: 'pos-001',
    token0: 'ETH',
    token1: 'USDC',
    liquidity: '45230.82',
    feeTier: 3000,
    inRange: true,
    feesEarned: '127.43',
  },
  {
    id: 'pos-002',
    token0: 'WBTC',
    token1: 'ETH',
    liquidity: '12891.50',
    feeTier: 500,
    inRange: true,
    feesEarned: '34.87',
  },
  {
    id: 'pos-003',
    token0: 'USDC',
    token1: 'USDT',
    liquidity: '25000.00',
    feeTier: 100,
    inRange: false,
    feesEarned: '8.12',
  },
]

export const celoTransactions: CeloTransaction[] = [
  {
    hash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    from: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    to: '0x8BaBf109551bD432803012645Ac136ddd64DBA72',
    value: '250.00',
    token: 'CELO',
    timestamp: NOW - 7200,
    status: 'success',
  },
  {
    hash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    from: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    to: '0x3F4C12a6b789dD15d9C4fE6C9B7E8a3b1D2e4F5',
    value: '100.00',
    token: 'cUSD',
    timestamp: NOW - 28800,
    status: 'success',
  },
  {
    hash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    from: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    to: '0x1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0B',
    value: '50.00',
    token: 'cEUR',
    timestamp: NOW - 86400,
    status: 'failed',
  },
  {
    hash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    from: '0x9B8C7D6E5F4A3B2C1D0E9F8A7B6C5D4E3F2A1B0',
    to: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    value: '500.00',
    token: 'CELO',
    timestamp: NOW - 172800,
    status: 'success',
  },
  {
    hash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    from: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    to: '0x5C6D7E8F9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D',
    value: '75.50',
    token: 'cUSD',
    timestamp: NOW - 259200,
    status: 'pending',
  },
  {
    hash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    from: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    to: '0x2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1',
    value: '1000.00',
    token: 'CELO',
    timestamp: NOW - 432000,
    status: 'success',
  },
  {
    hash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    from: '0x6E7F8A9B0C1D2E3F4A5B6C7D8E9F0A1B2C3D4E5',
    to: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    value: '200.00',
    token: 'cUSD',
    timestamp: NOW - 604800,
    status: 'success',
  },
]

export const celoBalances: CeloBalance[] = [
  { token: 'Celo', symbol: 'CELO', balance: '1842.73', usdValue: '1842.73' },
  { token: 'Celo Dollar', symbol: 'cUSD', balance: '4231.50', usdValue: '4231.50' },
  { token: 'Celo Euro', symbol: 'cEUR', balance: '850.00', usdValue: '918.00' },
  { token: 'USD Coin', symbol: 'USDC', balance: '312.45', usdValue: '312.45' },
]

export const delegations: Delegation[] = [
  {
    id: 'del-001',
    delegate: '0x1F2a3B4C5D6E7F8A9B0c1D2E3f4A5b6C7D8e9F0a',
    delegator: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    caveats: ['allowedTargets: Uniswap V3 Router 0xE592427A0AEce92De3Edee1F18E0157C05861564', 'nativeTokenTransferAmount: 0.5 ETH/day'],
    authority: '0x0000000000000000000000000000000000000000',
    createdAt: NOW - 604800,
    active: true,
    spendLimit: '0.5',
    spentSoFar: '0.23',
  },
  {
    id: 'del-002',
    delegate: '0x3C4d5E6f7A8b9C0D1e2F3a4B5c6D7e8F9A0b1C2d',
    delegator: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    caveats: ['allowedMethods: bankr.execute', 'valueLte: 100 USDC/request'],
    authority: '0x0000000000000000000000000000000000000000',
    createdAt: NOW - 1209600,
    active: true,
    spendLimit: '500',
    spentSoFar: '127.40',
  },
  {
    id: 'del-003',
    delegate: '0x4D5e6F7a8B9c0D1E2f3A4b5C6d7E8f9A0b1C2D3e',
    delegator: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    caveats: ['allowedTargets: Olas Registry 0xE3607b00E75f6405248323A9417ff6b39B244b50', 'nativeTokenTransferAmount: 10 ETH/month'],
    authority: '0x0000000000000000000000000000000000000000',
    createdAt: NOW - 2592000,
    active: true,
    spendLimit: '10',
    spentSoFar: '3.75',
  },
  {
    id: 'del-004',
    delegate: '0x5E6f7A8b9C0d1E2F3a4B5c6D7e8F9a0B1c2D3E4f',
    delegator: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    caveats: ['allowedTargets: SuperRare Market 0x6D7923882aad385a5533e007D1B64d668B50e02B', 'nativeTokenTransferAmount: 2 ETH/day'],
    authority: '0x0000000000000000000000000000000000000000',
    createdAt: NOW - 1728000,
    active: false,
    spendLimit: '2',
    spentSoFar: '0',
  },
  {
    id: 'del-005',
    delegate: '0x6F7a8B9c0D1e2F3A4b5C6d7E8f9A0B1C2d3E4f5A',
    delegator: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
    caveats: ['allowedTargets: Octant Vault 0xf2730a6e5Cda58aD0Ef0bB6e5D0C3c3db5EaD05e', 'valueLte: 50 GLM/epoch'],
    authority: '0x0000000000000000000000000000000000000000',
    createdAt: NOW - 864000,
    active: true,
    spendLimit: '50',
    spentSoFar: '50',
  },
]
export const bankrUsage: BankrUsage[] = (() => {
  const today = new Date()
  const fmt = (d: Date) => d.toISOString().split('T')[0]
  const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d) }
  return [
    { date: daysAgo(0), model: 'claude-sonnet-4-6', inputTokens: 12450, outputTokens: 3820, costUsd: 0.312 },
    { date: daysAgo(0), model: 'claude-haiku-4-5', inputTokens: 8900, outputTokens: 4100, costUsd: 0.087 },
    { date: daysAgo(1), model: 'claude-sonnet-4-6', inputTokens: 15230, outputTokens: 5640, costUsd: 0.421 },
    { date: daysAgo(1), model: 'gpt-5-mini', inputTokens: 6780, outputTokens: 2910, costUsd: 0.098 },
    { date: daysAgo(2), model: 'gpt-5-mini', inputTokens: 45600, outputTokens: 12300, costUsd: 0.089 },
    { date: daysAgo(2), model: 'claude-sonnet-4-6', inputTokens: 9100, outputTokens: 3200, costUsd: 0.245 },
    { date: daysAgo(3), model: 'claude-sonnet-4-6', inputTokens: 11200, outputTokens: 4800, costUsd: 0.334 },
    { date: daysAgo(3), model: 'gpt-5-mini', inputTokens: 38900, outputTokens: 9400, costUsd: 0.071 },
    { date: daysAgo(4), model: 'claude-sonnet-4-6', inputTokens: 7800, outputTokens: 2900, costUsd: 0.198 },
    { date: daysAgo(5), model: 'claude-sonnet-4-6', inputTokens: 13400, outputTokens: 5200, costUsd: 0.389 },
  ]
})()
export const bankrLimits: BankrLimit[] = [
  { model: 'gpt-4o', dailyLimit: 5.00, used: 1.98, remaining: 3.02 },
  { model: 'claude-3-5-sonnet', dailyLimit: 5.00, used: 1.21, remaining: 3.79 },
  { model: 'gpt-4o-mini', dailyLimit: 2.00, used: 0.37, remaining: 1.63 },
]

export const superRareArtworks: SuperRareArtwork[] = [
  {
    id: 'art-001',
    title: 'Neural Cascade #7',
    imageUrl: '/placeholder-art-1.jpg',
    createdAt: NOW - 2592000,
    status: 'sold',
    price: '1.25',
    currency: 'ETH',
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
  {
    id: 'art-002',
    title: 'Synthetic Dreams Vol. 3',
    imageUrl: '/placeholder-art-2.jpg',
    createdAt: NOW - 1728000,
    status: 'listed',
    price: '0.85',
    currency: 'ETH',
  },
  {
    id: 'art-003',
    title: 'Latent Space Geometry',
    imageUrl: '/placeholder-art-3.jpg',
    createdAt: NOW - 1209600,
    status: 'listed',
    price: '2.10',
    currency: 'ETH',
  },
  {
    id: 'art-004',
    title: 'Protocol Ghost',
    imageUrl: '/placeholder-art-4.jpg',
    createdAt: NOW - 864000,
    status: 'unlisted',
  },
  {
    id: 'art-005',
    title: 'Eigenvalue Portrait',
    imageUrl: '/placeholder-art-5.jpg',
    createdAt: NOW - 432000,
    status: 'sold',
    price: '3.40',
    currency: 'ETH',
    txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
  },
]

export const superRareSales: SuperRareSale[] = [
  {
    id: 'sale-001',
    artworkTitle: 'Neural Cascade #7',
    salePrice: '1.25',
    currency: 'ETH',
    buyer: '0x9A0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B',
    timestamp: NOW - 604800,
    txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
  },
  {
    id: 'sale-002',
    artworkTitle: 'Eigenvalue Portrait',
    salePrice: '3.40',
    currency: 'ETH',
    buyer: '0x0B1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C',
    timestamp: NOW - 172800,
    txHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
  },
  {
    id: 'sale-003',
    artworkTitle: 'Entropy Field #2',
    salePrice: '0.72',
    currency: 'ETH',
    buyer: '0x1C2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D',
    timestamp: NOW - 1296000,
    txHash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
  },
  {
    id: 'sale-004',
    artworkTitle: 'Digital Meridian',
    salePrice: '0.54',
    currency: 'ETH',
    buyer: '0x2D3E4F5A6B7C8D9E0F1A2B3C4D5E6F7A8B9C0D1E',
    timestamp: NOW - 2160000,
    txHash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b',
  },
]

export const octantAllocations: OctantAllocation[] = [
  {
    projectName: 'Protocol Guild',
    projectAddress: '0xF29Ff96aaEa6C9A1fBa851f74737f3c069d4f1a9',
    amount: '120.00',
    epoch: 5,
    timestamp: NOW - 432000,
  },
  {
    projectName: 'Gitcoin',
    projectAddress: '0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6',
    amount: '80.00',
    epoch: 5,
    timestamp: NOW - 432000,
  },
  {
    projectName: 'Ethereum Foundation',
    projectAddress: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe',
    amount: '200.00',
    epoch: 5,
    timestamp: NOW - 432000,
  },
  {
    projectName: 'Giveth',
    projectAddress: '0x4D9339dd97db55e3B9bCBE65dE39fF9c04d1C2cd',
    amount: '60.00',
    epoch: 5,
    timestamp: NOW - 432000,
  },
  {
    projectName: 'Olas Public Goods',
    projectAddress: '0x9c0Ea4F748D5Cf19b2D0F42B4a5893C26f6a1E7b',
    amount: '40.00',
    epoch: 5,
    timestamp: NOW - 432000,
  },
]

export const octantEpochs: OctantEpoch[] = [
  {
    number: 5,
    startTime: NOW - 7776000,
    endTime: NOW + 1123200,
    totalRewards: '50000.00',
    matchedRewards: '12500.00',
  },
  {
    number: 4,
    startTime: NOW - 15552000,
    endTime: NOW - 7776000,
    totalRewards: '45000.00',
    matchedRewards: '11250.00',
  },
]

export const olasAgents: OlasAgent[] = [
  {
    id: 'agent-001',
    name: 'Trading Scout Alpha',
    description: 'Monitors DeFi opportunities and executes arbitrage across Uniswap pools',
    status: 'active',
    serviceId: 'svc-014',
    network: 'mainnet',
    stakedAmount: '100.00',
    lastActive: NOW - 300,
  },
  {
    id: 'agent-002',
    name: 'Celo Yield Optimizer',
    description: 'Auto-compounds cUSD yields on Celo lending protocols',
    status: 'active',
    serviceId: 'svc-027',
    network: 'celo',
    stakedAmount: '50.00',
    lastActive: NOW - 900,
  },
  {
    id: 'agent-003',
    name: 'NFT Floor Watcher',
    description: 'Tracks SuperRare floor prices and alerts on significant movements',
    status: 'idle',
    serviceId: 'svc-031',
    network: 'mainnet',
    stakedAmount: '25.00',
    lastActive: NOW - 7200,
  },
  {
    id: 'agent-004',
    name: 'Public Goods Voter',
    description: 'Participates in Octant allocation rounds based on defined preferences',
    status: 'idle',
    serviceId: 'svc-008',
    network: 'mainnet',
    stakedAmount: '75.00',
    lastActive: NOW - 43200,
  },
  {
    id: 'agent-005',
    name: 'Cross-chain Bridge Scout',
    description: 'Monitors bridge liquidity on Base/mainnet and triggers rebalancing',
    status: 'stopped',
    serviceId: 'svc-042',
    network: 'base',
    stakedAmount: '200.00',
    lastActive: NOW - 259200,
  },
]

export const olasServices: OlasService[] = [
  {
    id: 'svc-014',
    name: 'DeFi Arbitrage Service',
    description: 'Multi-agent service for cross-protocol arbitrage detection and execution',
    agentCount: 3,
    state: 'DEPLOYED',
    multisig: '0xDeF1a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a',
  },
  {
    id: 'svc-027',
    name: 'Celo Yield Service',
    description: 'Automated yield optimization for Celo stablecoin positions',
    agentCount: 2,
    state: 'DEPLOYED',
    multisig: '0xCe10b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9',
  },
  {
    id: 'svc-042',
    name: 'Bridge Monitor Service',
    description: 'Monitors cross-chain bridge health and liquidity across supported networks',
    agentCount: 4,
    state: 'PRE_REGISTRATION',
    multisig: '0xB11d2e3F4a5B6c7D8e9F0a1B2c3D4e5F6a7B8c9D',
  },
]

export const agentSummary: AgentSummary = {
  totalSpendUsd: 24.87,
  activeAgents: 2,
  tasksInProgress: 7,
  alerts: 1,
}

export const dailySpendData = (() => {
  const today = new Date()
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (13 - i))
    const day = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    return {
      day,
      uniswap: +(Math.random() * 2.5 + 0.5).toFixed(2),
      bankr: +(Math.random() * 0.8 + 0.2).toFixed(2),
      olas: +(Math.random() * 1.0 + 0.3).toFixed(2),
      other: +(Math.random() * 0.4).toFixed(2),
    }
  })
})()
