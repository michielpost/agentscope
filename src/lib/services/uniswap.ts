import type { UniswapSwap, UniswapPosition } from '@/types'
import { uniswapSwaps as mockSwaps, uniswapPositions as mockPositions } from '@/lib/mock-data'

async function querySubgraph<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const url = process.env.NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL
  if (!url) throw new Error('NEXT_PUBLIC_UNISWAP_SUBGRAPH_URL not configured')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`Subgraph error: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data as T
}

export async function fetchUniswapSwaps(address: string): Promise<UniswapSwap[]> {
  try {
    const query = `
      query GetSwaps($owner: String!) {
        swaps(where: { origin: $owner }, first: 20, orderBy: timestamp, orderDirection: desc) {
          id
          token0 { symbol }
          token1 { symbol }
          amount0
          amount1
          timestamp
          transaction { id }
          pool { feeTier }
        }
      }
    `
    const data = await querySubgraph<{ swaps: Record<string, unknown>[] }>(query, {
      owner: address.toLowerCase(),
    })
    return (data.swaps ?? []).map((s) => {
      const token0 = s.token0 as Record<string, string>
      const token1 = s.token1 as Record<string, string>
      const tx = s.transaction as Record<string, string>
      const amount0 = parseFloat(String(s.amount0))
      const amount1 = parseFloat(String(s.amount1))
      const isToken0In = amount0 < 0
      return {
        id: String(s.id),
        tokenIn: isToken0In ? token1.symbol : token0.symbol,
        tokenOut: isToken0In ? token0.symbol : token1.symbol,
        amountIn: Math.abs(isToken0In ? amount1 : amount0).toFixed(4),
        amountOut: Math.abs(isToken0In ? amount0 : amount1).toFixed(4),
        timestamp: Number(s.timestamp),
        txHash: tx?.id ?? '',
        network: 'mainnet',
      }
    })
  } catch {
    // Return empty when connected — don't mask real "no activity" with mock data
    return []
  }
}

export async function fetchUniswapPositions(address: string): Promise<UniswapPosition[]> {
  try {
    const query = `
      query GetPositions($owner: String!) {
        positions(where: { owner: $owner }, first: 20) {
          id
          token0 { symbol }
          token1 { symbol }
          liquidity
          pool { feeTier tick tickLower { tickIdx } tickUpper { tickIdx } }
          collectedFeesToken0
          collectedFeesToken1
        }
      }
    `
    const data = await querySubgraph<{ positions: Record<string, unknown>[] }>(query, {
      owner: address.toLowerCase(),
    })
    return (data.positions ?? []).map((p) => {
      const token0 = p.token0 as Record<string, string>
      const token1 = p.token1 as Record<string, string>
      const pool = p.pool as Record<string, unknown>
      const tickLower = pool.tickLower as Record<string, unknown>
      const tickUpper = pool.tickUpper as Record<string, unknown>
      const tick = Number(pool.tick)
      const inRange =
        tick >= Number(tickLower.tickIdx) && tick <= Number(tickUpper.tickIdx)
      const fees =
        parseFloat(String(p.collectedFeesToken0)) +
        parseFloat(String(p.collectedFeesToken1))
      return {
        id: String(p.id),
        token0: token0.symbol,
        token1: token1.symbol,
        liquidity: String(p.liquidity),
        feeTier: Number(pool.feeTier),
        inRange,
        feesEarned: fees.toFixed(2),
      }
    })
  } catch {
    return []
  }
}
