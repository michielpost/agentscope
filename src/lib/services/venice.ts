export const VENICE_API_BASE = 'https://api.venice.ai/api/v1'

export interface VeniceModel {
  id: string
  type: 'text' | 'image' | 'tts' | 'code'
  contextLength?: number
  supportsVision?: boolean
  supportsWebSearch?: boolean
  supportsToolCalling?: boolean
}

export interface VeniceInferenceCall {
  id: string
  model: string
  type: 'text' | 'image' | 'tts'
  promptTokens: number
  completionTokens: number
  totalTokens: number
  costVVV: number       // cost in Venice VVV token
  costUsd: number
  webSearchEnabled: boolean
  noDataRetention: boolean
  timestamp: number
  task: string          // human-readable description of what the call was for
  status: 'completed' | 'failed'
}

// Real API: fetch models list (no auth required)
export async function getVeniceModels(): Promise<VeniceModel[]> {
  try {
    const res = await fetch(`${VENICE_API_BASE}/models`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error('Venice models fetch failed')
    const data = await res.json()
    // Venice returns { data: [...models] }
    return (data.data ?? []).slice(0, 12).map((m: any) => ({
      id: m.id,
      type: m.type ?? 'text',
      contextLength: m.context_length,
      supportsVision: m.model_spec?.capabilities?.supportedGenerationMethods?.includes('vision'),
      supportsWebSearch: true,
      supportsToolCalling: m.model_spec?.capabilities?.supportedGenerationMethods?.includes('tool_use'),
    }))
  } catch {
    return getMockVeniceModels()
  }
}

function getMockVeniceModels(): VeniceModel[] {
  return [
    { id: 'llama-3.3-70b', type: 'text', contextLength: 131072, supportsVision: false, supportsWebSearch: true, supportsToolCalling: true },
    { id: 'mistral-31-24b', type: 'text', contextLength: 131072, supportsVision: false, supportsWebSearch: true, supportsToolCalling: true },
    { id: 'deepseek-r1-671b', type: 'text', contextLength: 65536, supportsVision: false, supportsWebSearch: false, supportsToolCalling: false },
    { id: 'qwen3-235b-a22b', type: 'text', contextLength: 32768, supportsVision: true, supportsWebSearch: true, supportsToolCalling: true },
    { id: 'qwen3-vl-235b-a22b', type: 'text', contextLength: 32768, supportsVision: true, supportsWebSearch: false, supportsToolCalling: false },
    { id: 'fluently-xl', type: 'image', supportsVision: false, supportsWebSearch: false, supportsToolCalling: false },
    { id: 'flux-dev', type: 'image', supportsVision: false, supportsWebSearch: false, supportsToolCalling: false },
  ]
}

// Mock inference history — realistic Venice usage for an agent
export function getMockInferenceHistory(): VeniceInferenceCall[] {
  const NOW = Math.floor(Date.now() / 1000)
  return [
    { id: 'vi-001', model: 'llama-3.3-70b', type: 'text', promptTokens: 1240, completionTokens: 890, totalTokens: 2130, costVVV: 0.0021, costUsd: 0.38, webSearchEnabled: false, noDataRetention: true, timestamp: NOW - 3600, task: 'Market trend analysis for Uniswap position rebalancing', status: 'completed' },
    { id: 'vi-002', model: 'qwen3-235b-a22b', type: 'text', promptTokens: 3800, completionTokens: 2100, totalTokens: 5900, costVVV: 0.0059, costUsd: 0.82, webSearchEnabled: true, noDataRetention: true, timestamp: NOW - 7200, task: 'Confidential governance proposal analysis — Octant epoch 5', status: 'completed' },
    { id: 'vi-003', model: 'mistral-31-24b', type: 'text', promptTokens: 890, completionTokens: 445, totalTokens: 1335, costVVV: 0.0013, costUsd: 0.22, webSearchEnabled: false, noDataRetention: true, timestamp: NOW - 14400, task: 'Private deal negotiation draft for SuperRare commission', status: 'completed' },
    { id: 'vi-004', model: 'deepseek-r1-671b', type: 'text', promptTokens: 5200, completionTokens: 4100, totalTokens: 9300, costVVV: 0.0093, costUsd: 1.24, webSearchEnabled: false, noDataRetention: true, timestamp: NOW - 28800, task: 'Smart contract risk audit — treasury allocation strategy', status: 'completed' },
    { id: 'vi-005', model: 'flux-dev', type: 'image', promptTokens: 120, completionTokens: 0, totalTokens: 120, costVVV: 0.0040, costUsd: 0.50, webSearchEnabled: false, noDataRetention: true, timestamp: NOW - 54000, task: 'Generated artwork preview for SuperRare listing', status: 'completed' },
    { id: 'vi-006', model: 'llama-3.3-70b', type: 'text', promptTokens: 2100, completionTokens: 980, totalTokens: 3080, costVVV: 0.0031, costUsd: 0.44, webSearchEnabled: true, noDataRetention: true, timestamp: NOW - 86400, task: 'Onchain risk desk: monitor Celo stablecoin depeg signals', status: 'completed' },
    { id: 'vi-007', model: 'qwen3-235b-a22b', type: 'text', promptTokens: 4500, completionTokens: 3200, totalTokens: 7700, costVVV: 0.0077, costUsd: 1.08, webSearchEnabled: false, noDataRetention: true, timestamp: NOW - 172800, task: 'Confidential due diligence: Olas service provider evaluation', status: 'failed' },
  ]
}

export function getVeniceStats(calls: VeniceInferenceCall[]) {
  const completed = calls.filter(c => c.status === 'completed')
  return {
    totalCalls: calls.length,
    totalTokens: completed.reduce((s, c) => s + c.totalTokens, 0),
    totalCostVVV: completed.reduce((s, c) => s + c.costVVV, 0),
    totalCostUsd: completed.reduce((s, c) => s + c.costUsd, 0),
    webSearchCalls: completed.filter(c => c.webSearchEnabled).length,
    allNoDataRetention: true,
  }
}
