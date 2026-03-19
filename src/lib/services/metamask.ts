// ERC-7710 MetaMask Delegation Toolkit — real on-chain reads via viem
// Queries the DelegationManager contract deployed by MetaMask on Base Sepolia
// Falls back to mock data if the chain is unreachable or no delegations are found.
import { createPublicClient, http, parseAbiItem } from 'viem'
import { baseSepolia } from 'viem/chains'
import { delegations as mockDelegations } from '@/lib/mock-data'
import type { Delegation } from '@/types'

// MetaMask Delegation Toolkit v1 — DelegationManager on Base Sepolia (84532)
// https://github.com/MetaMask/delegation-framework
const DELEGATION_MANAGER = '0x63c0c19a282a1B52b07dD5a65b58948A07DAE32B' as const

// DelegationEnabled event: emitted when a new delegation is created
const DELEGATION_ENABLED_EVENT = parseAbiItem(
  'event DelegationEnabled(address indexed delegate, address indexed delegator, bytes32 indexed delegationHash)'
)

// DelegationDisabled event: emitted when a delegation is revoked
const DELEGATION_DISABLED_EVENT = parseAbiItem(
  'event DelegationDisabled(address indexed delegate, address indexed delegator, bytes32 indexed delegationHash)'
)

function getClient() {
  return createPublicClient({
    chain: baseSepolia,
    transport: http('https://sepolia.base.org'),
  })
}

export async function fetchDelegations(address: string): Promise<Delegation[]> {
  try {
    const client = getClient()
    const addr = address as `0x${string}`

    // Fetch delegations where this address is the delegator (granting permissions)
    const [enabledLogs, disabledLogs] = await Promise.all([
      client.getLogs({
        address: DELEGATION_MANAGER,
        event: DELEGATION_ENABLED_EVENT,
        args: { delegator: addr },
        fromBlock: 'earliest',
        toBlock: 'latest',
      }),
      client.getLogs({
        address: DELEGATION_MANAGER,
        event: DELEGATION_DISABLED_EVENT,
        args: { delegator: addr },
        fromBlock: 'earliest',
        toBlock: 'latest',
      }),
    ])

    if (enabledLogs.length === 0) {
      // No on-chain delegations found for this address
      return []
    }

    const disabledHashes = new Set(disabledLogs.map((l) => l.args.delegationHash))

    const delegations: Delegation[] = enabledLogs.map((log, i) => ({
      id: `del-onchain-${i + 1}`,
      delegate: log.args.delegate ?? '0x0000000000000000000000000000000000000000',
      delegator: log.args.delegator ?? addr,
      caveats: [`delegationHash: ${log.args.delegationHash}`],
      authority: '0x0000000000000000000000000000000000000000',
      createdAt: Number(log.blockNumber ?? BigInt(0)),
      active: !disabledHashes.has(log.args.delegationHash),
    }))

    return delegations
  } catch {
    // RPC unavailable or contract not deployed on this network
    return []
  }
}
