'use client'
import { useState, useEffect } from 'react'

export function useApiData<T>(fetcher: () => Promise<T>, fallback: T) {
  const [data, setData] = useState<T>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetcher()
      .then(setData)
      .catch((e: Error) => {
        setError(e.message)
        setData(fallback)
      })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { data, loading, error }
}
