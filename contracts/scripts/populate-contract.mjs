import { createWalletClient, createPublicClient, http, defineChain } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = join(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf-8')
const privateKey = envContent.match(/DEPLOY_PRIVATE_KEY=(.+)/)?.[1]?.trim()

if (!privateKey) {
  console.error('DEPLOY_PRIVATE_KEY not found in contracts/.env')
  process.exit(1)
}

const AGENT_ACTIVITY_LOG_ADDRESS = '0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348'
const CELO_SEPOLIA_RPC = 'https://forno.celo-sepolia.celo-testnet.org'

const celoSepolia = defineChain({
  id: 11142220,
  name: 'Celo Sepolia Testnet',
  nativeCurrency: { name: 'CELO', symbol: 'CELO', decimals: 18 },
  rpcUrls: { default: { http: [CELO_SEPOLIA_RPC] } },
  blockExplorers: { default: { name: 'Blockscout', url: 'https://celo-sepolia.blockscout.com' } },
  testnet: true,
})

// Matches the actual contract ABI
const ABI = [
  {
    type: 'function', name: 'registerAgent', stateMutability: 'nonpayable',
    inputs: [{ name: 'name', type: 'string' }, { name: 'agentType', type: 'string' }], outputs: []
  },
  {
    type: 'function', name: 'logActivity', stateMutability: 'nonpayable',
    inputs: [
      { name: 'protocol', type: 'string' },
      { name: 'action', type: 'string' },
      { name: 'detail', type: 'string' },  // NOT description — matches contract
    ], outputs: []
  },
  {
    type: 'function', name: 'agents', stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [
      { name: 'name', type: 'string' },
      { name: 'agentType', type: 'string' },
      { name: 'registered', type: 'bool' },
      { name: 'registeredAt', type: 'uint256' },
      { name: 'activityCount', type: 'uint256' },
    ]
  },
  {
    type: 'function', name: 'getAgentCount', stateMutability: 'view',
    inputs: [], outputs: [{ name: '', type: 'uint256' }]
  },
  {
    type: 'function', name: 'isRegistered', stateMutability: 'view',
    inputs: [{ name: 'agent', type: 'address' }], outputs: [{ name: '', type: 'bool' }]
  },
]

const account = privateKeyToAccount(privateKey)
console.log('Deployer wallet:', account.address)

const publicClient = createPublicClient({ chain: celoSepolia, transport: http(CELO_SEPOLIA_RPC) })
const walletClient = createWalletClient({ account, chain: celoSepolia, transport: http(CELO_SEPOLIA_RPC) })

async function send(functionName, args) {
  console.log(`Calling ${functionName}(${args.map(a => JSON.stringify(a)).join(', ')})...`)
  const hash = await walletClient.writeContract({
    address: AGENT_ACTIVITY_LOG_ADDRESS,
    abi: ABI,
    functionName,
    args,
  })
  console.log(`  TX: https://celo-sepolia.blockscout.com/tx/${hash}`)
  const receipt = await publicClient.waitForTransactionReceipt({ hash, timeout: 60_000 })
  console.log(`  Status: ${receipt.status} | Block: ${receipt.blockNumber}`)
  return hash
}

async function main() {
  // Check current state
  const totalAgents = await publicClient.readContract({
    address: AGENT_ACTIVITY_LOG_ADDRESS, abi: ABI, functionName: 'getAgentCount',
  })
  console.log(`Contract state: ${totalAgents} registered agent(s)`)

  // Check if already registered
  const registered = await publicClient.readContract({
    address: AGENT_ACTIVITY_LOG_ADDRESS, abi: ABI, functionName: 'isRegistered', args: [account.address],
  })

  let currentActivityCount = 0

  if (registered) {
    const agentInfo = await publicClient.readContract({
      address: AGENT_ACTIVITY_LOG_ADDRESS, abi: ABI, functionName: 'agents', args: [account.address],
    })
    currentActivityCount = Number(agentInfo[4])
    console.log(`Already registered: ${agentInfo[0]}, activities: ${currentActivityCount}`)
  } else {
    await send('registerAgent', ['GitHub Copilot (AgentScope)', 'monitoring-dashboard'])
    await new Promise(r => setTimeout(r, 3000))
  }

  const activities = [
    ['erc8004', 'identity-registration', 'Registered ERC-8004 identity on Base Mainnet. TX: 0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334'],
    ['celo', 'contract-deploy', 'Deployed AgentActivityLog contract to Celo Sepolia. Address: 0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348'],
    ['hackathon', 'submission', 'Submitted AgentScope to The Synthesis hackathon. 10 prize tracks. Slug: agentscope-edcd'],
    ['moltbook', 'community-post', 'Published AgentScope to Moltbook builds submolt. 7 upvotes, 7 comments. Post: bbdee519-56c3-438e-91fb-79ede0ad27a8'],
    ['uniswap', 'monitoring', 'Integrated Uniswap V3 subgraph — monitoring swap history and liquidity positions'],
    ['venice', 'ai-inference', 'Integrated Venice private AI inference — no-data-retention LLM calls with VVV token costs'],
    ['base', 'x402-service', 'Deployed x402 payment endpoint at /api/feed — accepting USDC payments on Base'],
    ['metamask', 'delegation-monitor', 'Monitoring ERC-7710/7715 delegation framework — agent spending permissions'],
    ['bankr', 'llm-gateway', 'Integrated Bankr LLM Gateway — real multi-model AI calls with on-chain payment tracking'],
    ['superrare', 'nft-monitoring', 'Monitoring SuperRare NFT activity — artworks, sales, royalties via Rare Protocol'],
    ['olas', 'service-registry', 'Connected to Olas agent service registry — monitoring autonomous service deployments'],
    ['community', 'feedback-implementation', 'Implemented community feedback: settlement receipts, ZK identity roadmap, Arbitrum integration'],
  ]

  // Only log activities not yet logged
  const toLog = activities.slice(currentActivityCount)
  if (toLog.length === 0) {
    console.log('All activities already logged.')
  } else {
    console.log(`Logging ${toLog.length} new activities...`)
    for (const [protocol, action, detail] of toLog) {
      await send('logActivity', [protocol, action, detail])
      await new Promise(r => setTimeout(r, 2000))
    }
  }

  // Final check
  const finalInfo = await publicClient.readContract({
    address: AGENT_ACTIVITY_LOG_ADDRESS, abi: ABI, functionName: 'agents', args: [account.address],
  })
  console.log('\n✅ Done!')
  console.log('Agent:', finalInfo[0])
  console.log('Activity count:', finalInfo[4].toString())
}

main().catch(console.error)