import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './use-auth'
import { supabase } from '@/lib/supabase'
import type { AgePost } from '@/types'

interface UserPostsStats {
  total_posts: number
  total_likes: number
}

interface UserPostsData {
  posts: AgePost[]
  stats: UserPostsStats
}

interface Pagination {
  page: number
  limit: number
  total: number
  total_pages: number
  has_next: boolean
  has_prev: boolean
}

interface UseUserPostsReturn {
  data: UserPostsData | null
  pagination: Pagination | null
  loading: boolean
  error: string | null
  refetch: () => void
  loadMore: () => void
  hasMore: boolean
}

export function useUserPosts(initialPage = 1, pageSize = 20): UseUserPostsReturn {
  const { user, isAuthenticated } = useAuth()
  const [data, setData] = useState<UserPostsData | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(initialPage)

  const fetchUserPosts = useCallback(async (page = 1, append = false) => {
    if (!isAuthenticated || !user) {
      setError('User not authenticated')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 直接使用 Supabase 查询用户的帖子
      const { data: posts, error, count } = await supabase
        .from('age_posts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (error) {
        throw error
      }

      const totalPages = Math.ceil((count || 0) / pageSize)
      const newPagination = {
        page,
        limit: pageSize,
        total: count || 0,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }

      const newData = {
        posts: posts || [],
        stats: {
          total_posts: count || 0,
          total_likes: 0, // 需要单独查询
          avg_likes: 0
        }
      }

      if (append) {
        // 追加数据（加载更多）
        setData(prevData => prevData ? {
          posts: [...prevData.posts, ...newData.posts],
          stats: newData.stats
        } : newData)
      } else {
        // 替换数据（刷新或首次加载）
        setData(newData)
      }
      setPagination(newPagination)
      setCurrentPage(page)
    } catch (err) {
      console.error('Error fetching user posts:', err)
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated, user, pageSize])

  const refetch = () => {
    fetchUserPosts(1, false)
  }

  const loadMore = () => {
    if (pagination?.has_next) {
      fetchUserPosts(currentPage + 1, true)
    }
  }

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserPosts(initialPage)
    } else {
      setData(null)
      setPagination(null)
      setError(null)
    }
  }, [isAuthenticated, user, initialPage, pageSize, fetchUserPosts])

  return {
    data,
    pagination,
    loading,
    error,
    refetch,
    loadMore,
    hasMore: pagination?.has_next || false
  }
}
