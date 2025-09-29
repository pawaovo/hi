'use client'

import { useState, useEffect } from 'react'
import { Users, MessageSquare, Heart, TrendingUp } from 'lucide-react'
import { ApiClient } from '@/lib/api-client'

export interface SiteStats {
  total_posts: number
  total_users: number
  total_likes: number
  active_user_groups: Array<{ ageRange: string; userCount: number }>
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

      // 直接使用 ApiClient 而不是 API 路由
      const result = await ApiClient.getSiteStats()
      setStats(result)
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
