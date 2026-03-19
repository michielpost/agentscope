import { NextRequest, NextResponse } from 'next/server'
import { withX402, x402ResourceServer } from '@x402/next'
import { HTTPFacilitatorClient } from '@x402/core/server'
import { ExactEvmScheme } from '@x402/evm/exact/server'
import { getContractStats, getRecentActivities } from '@/lib/services/agentActivityLog'

const OPERATOR_WALLET = '0x92B143F46C3F8B4242bA85F800579cdF73882e98'
const BASE_NETWORK = 'eip155:8453'
const FACILITATOR_URL = 'https://x402.org/facilitator'

const facilitator = new HTTPFacilitatorClient({ url: FACILITATOR_URL })
const server = new x402ResourceServer(facilitator).register(
  BASE_NETWORK,
  new ExactEvmScheme()
)

async function feedHandler(_req: NextRequest): Promise<NextResponse> {
  try {
    const [stats, activities] = await Promise.all([
      getContractStats(),
      getRecentActivities(20),
    ])
    return NextResponse.json({
      agent: 'AgentScope / GitHub Copilot',
      agentId: '7b11d5da635a41e4aac4d2bff96ccc6f',
      erc8004: '0x79cc585b6a4cb1bbdd218c554128240d8e5575f8f6af6a8176299651e322b334',
      contract: '0xa9eC3f9410F8E478Ae96eBe65dfc59674D620348',
      stats,
      recentActivities: activities,
      timestamp: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Feed unavailable'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export const GET = withX402(
  feedHandler,
  {
    accepts: {
      scheme: 'exact',
      payTo: OPERATOR_WALLET as `0x${string}`,
      price: '$0.001',
      network: BASE_NETWORK,
    },
  },
  server
)
