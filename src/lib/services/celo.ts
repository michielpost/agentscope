import { createPublicClient, http, formatEther } from 'viem'
import { celo } from 'viem/chains'
import type { CeloBalance, CeloTransaction } from '@/types'
import { celoBalances as mockBalances, celoTransactions as mockTxs } from '@/lib/mock-data'

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

const CUSD_ADDRESS = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const
const CEUR_ADDRESS = '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73' as const

let _cachedPrices: { celo: number; cusd: number; ceur: number } | null = null
let _pricesFetchedAt = 0

async function fetchLivePrices(): Promise<{ celo: number; cusd: number; ceur: number }> {
  const now = Date.now()
  if (_cachedPrices && now - _pricesFetchedAt < 60_000) return _cachedPrices
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=celo,celo-dollar,celo-euro&vs_currencies=usd',
      { next: { revalidate: 60 } }
    )
    if (!res.ok) throw new Error('price fetch failed')
    const data = await res.json()
    _cachedPrices = {
      celo: data?.celo?.usd ?? 0.60,
      cusd: data?.['celo-dollar']?.usd ?? 1.00,
      ceur: data?.['celo-euro']?.usd ?? 1.08,
    }
    _pricesFetchedAt = now
    return _cachedPrices
  } catch {
    return { celo: 0.60, cusd: 1.00, ceur: 1.08 }
  }
}

const BLOCKSCOUT_URL =
  process.env.NEXT_PUBLIC_CELO_BLOCKSCOUT_URL ?? 'https://explorer.celo.org/mainnet/api'

function getPublicClient() {
  return createPublicClient({
    chain: celo,
    transport: http(process.env.NEXT_PUBLIC_CELO_RPC_URL ?? 'https://forno.celo.org'),
  })
}

export async function fetchCeloBalances(address: string): Promise<CeloBalance[]> {
  try {
    const client = getPublicClient()
    const addr = address as `0x${string}`

    const [nativeBalance, cusdBalance, ceurBalance] = await Promise.all([
      client.getBalance({ address: addr }),
      client.readContract({
        address: CUSD_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [addr],
      }),
      client.readContract({
        address: CEUR_ADDRESS,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [addr],
      }),
    ])

    const celoAmt = parseFloat(formatEther(nativeBalance))
    const cusdAmt = parseFloat(formatEther(cusdBalance as bigint))
    const ceurAmt = parseFloat(formatEther(ceurBalance as bigint))

    const prices = await fetchLivePrices()

    return [
      {
        token: 'Celo',
        symbol: 'CELO',
        balance: celoAmt.toFixed(2),
        usdValue: (celoAmt * prices.celo).toFixed(2),
      },
      {
        token: 'Celo Dollar',
        symbol: 'cUSD',
        balance: cusdAmt.toFixed(2),
        usdValue: (cusdAmt * prices.cusd).toFixed(2),
      },
      {
        token: 'Celo Euro',
        symbol: 'cEUR',
        balance: ceurAmt.toFixed(2),
        usdValue: (ceurAmt * prices.ceur).toFixed(2),
      },
    ]
  } catch {
    return mockBalances
  }
}

export async function fetchCeloTransactions(address: string): Promise<CeloTransaction[]> {
  try {
    const res = await fetch(
      `${BLOCKSCOUT_URL}?module=account&action=txlist&address=${address}&sort=desc&limit=20`
    )
    if (!res.ok) throw new Error(`Blockscout error: ${res.status}`)
    const json = await res.json()
    if (json.status !== '1' || !Array.isArray(json.result)) throw new Error('No results')

    return json.result.map((tx: Record<string, string>) => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: parseFloat(formatEther(BigInt(tx.value))).toFixed(4),
      token: 'CELO',
      timestamp: parseInt(tx.timeStamp),
      status: (tx.isError === '0' ? 'success' : 'failed') as CeloTransaction['status'],
    }))
  } catch {
    return mockTxs
  }
}
