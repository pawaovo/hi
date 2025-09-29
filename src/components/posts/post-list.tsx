'use client'

import { useState, useEffect, useCallback } from 'react'
import { PostCard } from './post-card'
import { Empty } from '@/components/common/empty'
import { Error } from '@/components/common/error'
import { Button } from '@/components/ui/button'
import { PostCardSkeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ApiClient } from '@/lib/api-client'
import type { AgePost } from '@/types'
import { ChevronDown } from 'lucide-react'

interface PostListProps {
  targetAge: number
  refreshTrigger?: number
}



export function PostList({ targetAge, refreshTrigger }: PostListProps) {
  const [posts, setPosts] = useState<AgePost[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    hasMore: false,
    total: 0
  })

  const fetchPosts = useCallback(async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true)
        setError(null)
      } else {
        setLoadingMore(true)
      }

      // 直接使用 ApiClient 而不是 API 路由
      const result = await ApiClient.getPostsByAge(targetAge, page, 20)

      if (append) {
        setPosts(prev => [...prev, ...result.posts])
      } else {
        setPosts(result.posts)
      }

      setPagination({
        page: result.pagination.page,
        hasMore: result.pagination.has_next,
        total: result.pagination.total
      })
    } catch (err) {
      console.error('Error fetching posts:', err)
      setError('网络错误，请重试')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [targetAge])

  const handleLoadMore = () => {
    if (!loadingMore && pagination.hasMore) {
      fetchPosts(pagination.page + 1, true)
    }
  }

  const handlePostUpdate = (postId: string, updates: Partial<AgePost>) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, ...updates } : post
    ))
  }

  const handleRetry = () => {
    fetchPosts(1, false)
  }

  useEffect(() => {
    fetchPosts(1, false)
  }, [targetAge, refreshTrigger, fetchPosts])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            给{targetAge}岁的智慧分享
          </h3>
          <p className="text-sm text-muted-foreground">
            加载中...
          </p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <PostCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Error 
        message={error}
        onRetry={handleRetry}
      />
    )
  }

  if (posts.length === 0) {
    return (
      <Empty
        title="还没有人分享"
        description={`成为第一个为${targetAge}岁分享智慧的人吧！`}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <p className="text-sm text-muted-foreground">
          共 {pagination.total} 条
        </p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onUpdate={handlePostUpdate}
          />
        ))}
      </div>

      {pagination.hasMore && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="flex items-center space-x-2"
          >
            {loadingMore ? (
              <>
                <LoadingSpinner size="sm" />
                <span>加载中...</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>加载更多</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
