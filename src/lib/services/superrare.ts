import type { SuperRareArtwork, SuperRareSale } from '@/types'
import { superRareArtworks as mockArtworks, superRareSales as mockSales } from '@/lib/mock-data'

const SUPERRARE_API_URL =
  process.env.NEXT_PUBLIC_SUPERRARE_API_URL ?? 'https://api.superrare.com/graphql'

async function graphqlQuery<T>(
  query: string,
  variables: Record<string, unknown>
): Promise<T> {
  const res = await fetch(SUPERRARE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  })
  if (!res.ok) throw new Error(`SuperRare API error: ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(json.errors[0].message)
  return json.data as T
}

export async function fetchSuperRareArtworks(address: string): Promise<SuperRareArtwork[]> {
  try {
    const query = `
      query GetTokensByCreator($creator: String!) {
        tokens(where: { creator: $creator }, first: 10, orderBy: createdAt, orderDirection: desc) {
          id
          metadata { name image }
          createdAt
          salePrice
          currency
          status
        }
      }
    `
    const data = await graphqlQuery<{ tokens: Record<string, unknown>[] }>(query, {
      creator: address,
    })
    return (data.tokens ?? []).map((t) => {
      const meta = t.metadata as Record<string, string> | null
      return {
        id: String(t.id),
        title: meta?.name ?? 'Untitled',
        imageUrl: meta?.image ?? '',
        createdAt: Number(t.createdAt),
        status: (t.status as SuperRareArtwork['status']) ?? 'unlisted',
        price: t.salePrice ? String(t.salePrice) : undefined,
        currency: t.currency ? String(t.currency) : undefined,
      }
    })
  } catch {
    return []
  }
}

export async function fetchSuperRareSales(address: string): Promise<SuperRareSale[]> {
  try {
    const query = `
      query GetSalesByCreator($creator: String!) {
        transactions(
          where: { creator: $creator, type: "sold" }
          first: 10
          orderBy: timestamp
          orderDirection: desc
        ) {
          id
          token { metadata { name } }
          amount
          currency
          buyer
          timestamp
          transactionHash
        }
      }
    `
    const data = await graphqlQuery<{ transactions: Record<string, unknown>[] }>(query, {
      creator: address,
    })
    return (data.transactions ?? []).map((t) => {
      const token = t.token as Record<string, unknown> | null
      const meta = token?.metadata as Record<string, string> | null
      return {
        id: String(t.id),
        artworkTitle: meta?.name ?? 'Untitled',
        salePrice: String(t.amount ?? '0'),
        currency: String(t.currency ?? 'ETH'),
        buyer: String(t.buyer ?? ''),
        timestamp: Number(t.timestamp),
        txHash: String(t.transactionHash ?? ''),
      }
    })
  } catch {
    return []
  }
}
