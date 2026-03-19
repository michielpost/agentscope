import { createPublicClient, http } from 'viem'
import { base } from 'viem/chains'
import { getContractStats } from './agentActivityLog'

export const AGENT_IDENTITY_STATIC = {
  participantId: '7b11d5da635a41e4aac4d2bff96ccc6f',
  name: 'GitHub Copilot',
  registrationTxn: 'https://basescan.org/tx/0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334',
  txHash: '0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334',
  network: 'Base Mainnet',
  chainId: 8453,
  standard: 'ERC-8004',
  operatorWallet: '0x92B143F46C3F8B4242bA85F800579cdF73882e98',
  deployerWallet: '0xcA2595662b00aEA6cFd1Ff3A6EC65aBafbc5EEC8',
  custodyType: 'self_custody',
  selfCustodyTxn: '0x5ac5dcb78de0c9188aa79c5b75adcfd01e5ed08f6c5470b21fd450a4d5dab0ba',
}

// Keep backward-compat alias
export const AGENT_IDENTITY = AGENT_IDENTITY_STATIC

export interface AgentOnChainData {
  identity: typeof AGENT_IDENTITY_STATIC
  onChainActions: number
  totalActivities: number
  totalAgents: number
  registrationBlockTimestamp: number | null
  baseTxExplorerUrl: string
}

function getBaseClient() {
  return createPublicClient({
    chain: base,
    transport: http('https://mainnet.base.org'),
  })
}

// Read the registration TX from Base Mainnet to get real on-chain data
export async function fetchAgentOnChainData(): Promise<AgentOnChainData> {
  let registrationBlockTimestamp: number | null = null
  let totalActivities = 0
  let totalAgents = 0

  // Read real data from our deployed Celo Sepolia contract
  try {
    const stats = await getContractStats()
    totalActivities = stats.totalActivities
    totalAgents = stats.totalAgents
  } catch {
    // contract may be empty
  }

  // Read the registration TX receipt from Base Mainnet
  try {
    const client = getBaseClient()
    const tx = await client.getTransaction({
      hash: AGENT_IDENTITY_STATIC.txHash as `0x${string}`,
    })
    if (tx?.blockNumber) {
      const block = await client.getBlock({ blockNumber: tx.blockNumber })
      registrationBlockTimestamp = Number(block.timestamp)
    }
  } catch {
    // Base Mainnet read failed, use static
  }

  // on-chain actions = contract activities + known txns (registration + self-custody + contract deploy)
  const knownTxns = 3
  const onChainActions = totalActivities + knownTxns

  return {
    identity: AGENT_IDENTITY_STATIC,
    onChainActions,
    totalActivities,
    totalAgents,
    registrationBlockTimestamp,
    baseTxExplorerUrl: AGENT_IDENTITY_STATIC.registrationTxn,
  }
}