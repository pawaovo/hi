'use client'

import { useAuth } from '@/hooks/use-auth'
import { useUserPosts } from '@/hooks/use-user-posts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { PostCardSkeleton } from '@/components/ui/skeleton'
import { Heart, Calendar, TrendingUp, MessageSquare } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function UserPostsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data, pagination, loading, error, refetch, loadMore, hasMore } = useUserPosts()
  const router = useRouter()

  // 如果未登录，重定向到首页
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的发布</h1>
          <p className="text-gray-600">查看您发布的所有智慧分享</p>
        </div>

        {/* 统计卡片 */}
        {data?.stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">总发布数</p>
                    <p className="text-2xl font-bold text-gray-900">{data.stats.total_posts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">总获赞数</p>
                    <p className="text-2xl font-bold text-gray-900">{data.stats.total_likes}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">平均获赞</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {data.stats.total_posts > 0 
                        ? Math.round(data.stats.total_likes / data.stats.total_posts * 10) / 10
                        : 0
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 发布列表 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>发布历史</span>
              <Button variant="outline" size="sm" onClick={refetch} disabled={loading}>
                刷新
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading && !data && (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <PostCardSkeleton key={i} />
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={refetch} variant="outline">
                  重试
                </Button>
              </div>
            )}

            {data && data.posts.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">还没有发布内容</h3>
                <p className="text-gray-600 mb-4">开始分享您的智慧吧！</p>
                <Link href="/">
                  <Button>去发布内容</Button>
                </Link>
              </div>
            )}

            {data && data.posts.length > 0 && (
              <div className="space-y-4">
                {data.posts.map((post) => (
                  <div
                    key={post.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <Link 
                          href={`/age/${post.target_age}`}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          给 {post.target_age} 岁的建议
                        </Link>
                        <p className="text-gray-900 mt-2 text-lg">
                          嗨 {post.target_age} 岁，{post.content}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDistanceToNow(new Date(post.created_at), { 
                            addSuffix: true, 
                            locale: zhCN 
                          })}
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600">来自 {post.author_age} 岁</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1 text-red-500" />
                        <span className="font-medium">{post.like_count}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* 加载更多按钮 */}
                {hasMore && (
                  <div className="text-center pt-6">
                    <Button 
                      variant="outline" 
                      onClick={loadMore} 
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          加载中...
                        </>
                      ) : (
                        '加载更多'
                      )}
                    </Button>
                  </div>
                )}

                {pagination && !hasMore && data.posts.length > 0 && (
                  <div className="text-center pt-6 text-gray-500">
                    已显示全部 {pagination.total} 条记录
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
