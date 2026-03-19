'use client'
import { useState, useEffect, useRef } from 'react'

export function useApiData<T>(fetcher: () => Promise<T>, fallback: T, deps: unknown[] = []) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetcherRef.current()
      .then(setData)
      .catch((e: Error) => {
        setError(e.message)
        setData(fallback)
      })
      .finally(() => setLoading(false))
  // deps controls when we re-fetch (e.g. when wallet address changes)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { data, loading, error }
}
