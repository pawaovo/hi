import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './use-auth'
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

      const response = await fetch(`/api/users/posts?user_id=${user.id}&page=${page}&limit=${pageSize}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (response.ok) {
        if (append) {
          // 追加数据（加载更多）
          setData(prevData => prevData ? {
            posts: [...prevData.posts, ...result.data.posts],
            stats: result.data.stats
          } : result.data)
        } else {
          // 替换数据（刷新或首次加载）
          setData(result.data)
        }
        setPagination(result.pagination)
        setCurrentPage(page)
      } else {
        setError(result.error || 'Failed to fetch user posts')
      }
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
