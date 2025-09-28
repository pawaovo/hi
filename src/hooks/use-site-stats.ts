'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react'

export interface SiteStats {
  total_posts: number
  total_users: number
  total_likes: number
  active_ages: number
}

export interface StatItem {
  icon: typeof MessageSquare
  label: string
  value: number
  color: string
}

export function useSiteStats(autoFetch = true) {
  const [stats, setStats] = useState<SiteStats | null>(null)
  const [loading, setLoading] = useState(autoFetch)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/stats/site')
      const result = await response.json()

      if (response.ok) {
        setStats(result.data)
      } else {
        setError(result.error || 'Failed to fetch stats')
      }
    } catch (err) {
      console.error('Error fetching site stats:', err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchStats()
    }
  }, [autoFetch])

  // 生成统计项配置
  const getStatItems = (): StatItem[] => {
    if (!stats) return []
    
    return [
      {
        icon: MessageSquare,
        label: '智慧分享',
        value: stats.total_posts,
        color: 'text-blue-600'
      },
      {
        icon: Users,
        label: '注册用户',
        value: stats.total_users,
        color: 'text-green-600'
      },
      {
        icon: Heart,
        label: '点赞总数',
        value: stats.total_likes,
        color: 'text-red-600'
      },
      {
        icon: TrendingUp,
        label: '活跃年龄段',
        value: stats.active_ages,
        color: 'text-purple-600'
      }
    ]
  }

  return {
    stats,
    loading,
    error,
    fetchStats,
    statItems: getStatItems()
  }
}
