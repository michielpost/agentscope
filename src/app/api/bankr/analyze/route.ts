import { NextResponse } from 'next/server'
import { callBankrLLM } from '@/lib/services/bankr'

export async function POST(request: Request) {
  try {
    const { prompt, model } = await request.json()
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt required' }, { status: 400 })
    }
    const result = await callBankrLLM(prompt, model)
    return NextResponse.json(result)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
