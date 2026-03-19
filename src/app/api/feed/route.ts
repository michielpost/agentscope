import { NextResponse } from 'next/server'
import { getContractStats, getRecentActivities } from '@/lib/services/agentActivityLog'

// This endpoint is designed to be monetizable via x402.
// Currently returns real agent activity data.
// x402 payment middleware can be layered on top.
export async function GET() {
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
      x402: {
        price: '0.001 USDC',
        network: 'Base',
        description: 'Real-time agent activity feed across 9 Web3 protocols',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Feed unavailable'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
