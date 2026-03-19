import type { BankrUsage, BankrLimit } from '@/types'
import { bankrUsage as mockUsage, bankrLimits as mockLimits } from '@/lib/mock-data'

export const BANKR_API_URL = 'https://llm.bankr.bot'

export interface BankrAnalysisResult {
  content: string
  model: string
  inputTokens: number
  outputTokens: number
  costUsd: number
  timestamp: number
}

// Server-side only: use in /api/bankr/* routes
export async function callBankrLLM(prompt: string, model = 'claude-sonnet-4-6'): Promise<BankrAnalysisResult> {
  const apiKey = process.env.BANKR_API_KEY
  if (!apiKey) throw new Error('BANKR_API_KEY not configured')

  const res = await fetch(`${BANKR_API_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1024,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Bankr API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const choice = data.choices?.[0]
  const usage = data.usage ?? {}

  return {
    content: choice?.message?.content ?? '',
    model: data.model ?? model,
    inputTokens: usage.prompt_tokens ?? 0,
    outputTokens: usage.completion_tokens ?? 0,
    costUsd: estimateCost(model, usage.prompt_tokens ?? 0, usage.completion_tokens ?? 0),
    timestamp: Math.floor(Date.now() / 1000),
  }
}

function estimateCost(model: string, input: number, output: number): number {
  const rates: Record<string, [number, number]> = {
    'claude-opus-4': [0.015, 0.075],
    'claude-sonnet-4-6': [0.003, 0.015],
    'claude-haiku-4-5': [0.00025, 0.00125],
    'gpt-5': [0.010, 0.030],
    'gpt-5-mini': [0.00015, 0.0006],
    'gemini-3-pro': [0.00125, 0.005],
  }
  const [inputRate, outputRate] = rates[model] ?? [0.003, 0.015]
  return +((input / 1000) * inputRate + (output / 1000) * outputRate).toFixed(4)
}

// Try to fetch real usage from Bankr API
export async function fetchBankrUsage(): Promise<BankrUsage[]> {
  try {
    const apiKey = process.env.BANKR_API_KEY
    if (!apiKey) throw new Error('no key')
    const res = await fetch(`https://api.bankr.bot/v1/usage`, {
      headers: { 'X-API-Key': apiKey },
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data?.usage)) throw new Error('unexpected shape')
    return data.usage
  } catch {
    return mockUsage
  }
}

export async function fetchBankrLimits(): Promise<BankrLimit[]> {
  try {
    const apiKey = process.env.BANKR_API_KEY
    if (!apiKey) throw new Error('no key')
    const res = await fetch(`https://api.bankr.bot/v1/limits`, {
      headers: { 'X-API-Key': apiKey },
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error(`${res.status}`)
    const data = await res.json()
    if (!Array.isArray(data?.limits)) throw new Error('unexpected shape')
    return data.limits
  } catch {
    return mockLimits
  }
}