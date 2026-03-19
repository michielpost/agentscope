'use client'
import { useApiData } from './useApiData'
import { fetchOlasAgents, fetchOlasServices } from '@/lib/services/olas'
import { olasAgents as mockAgents, olasServices as mockServices } from '@/lib/mock-data'

export function useOlasAgents() {
  return useApiData(() => fetchOlasAgents(), mockAgents)
}

export function useOlasServices() {
  return useApiData(() => fetchOlasServices(), mockServices)
}
