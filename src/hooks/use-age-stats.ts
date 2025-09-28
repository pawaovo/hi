import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '@/lib/constants'

interface AgeStatsItem {
  target_age: number
  post_count: number
}

interface UseAgeStatsReturn {
  ageStats: AgeStatsItem[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAgeStats(): UseAgeStatsReturn {
  const [ageStats, setAgeStats] = useState<AgeStatsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAgeStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(API_ENDPOINTS.AGES)
      const result = await response.json()
      
      if (response.ok) {
        setAgeStats(result.data || [])
      } else {
        setError(result.error || 'Failed to fetch data')
      }
    } catch (err) {
      setError('Network error')
      console.error('Error fetching age stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgeStats()
  }, [])

  return {
    ageStats,
    loading,
    error,
    refetch: fetchAgeStats
  }
}
