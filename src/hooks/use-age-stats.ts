import { useState, useEffect } from 'react'
import { ApiClient } from '@/lib/api-client'

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

      const ageCounts = await ApiClient.getAgeStats()

      // 转换为组件期望的格式
      const statsArray = Object.entries(ageCounts).map(([age, count]) => ({
        target_age: parseInt(age),
        post_count: count
      }))

      setAgeStats(statsArray)
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
