'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Heart, MessageSquare, Calendar, User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Post {
  id: string
  target_age: number
  content: string
  author_age: number
  like_count: number
  created_at: string
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, signOut } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const router = useRouter()

  // 样式常量，避免重复
  const cardItemStyles = "flex items-center h-6"
  const textSecondaryStyles = "text-sm text-slate-500"

  const fetchUserPosts = useCallback(async () => {
    try {
      const response = await fetch(`/api/users/posts?user_id=${user?.id}`)
      if (response.ok) {
        const result = await response.json()
        setPosts(result.data?.posts || [])
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
    } finally {
      setIsLoadingPosts(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
      return
    }

    if (user?.id) {
      fetchUserPosts()
    }
  }, [user, isAuthenticated, isLoading, router, fetchUserPosts])

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto"></div>
          <p className="mt-2 text-slate-600">加载中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 用户信息卡片 */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user?.username}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <Calendar className="w-4 h-4 mr-1" />
                      加入时间：{user?.created_at ? formatDistanceToNow(new Date(user.created_at), { 
                        addSuffix: true, 
                        locale: zhCN 
                      }) : '未知'}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={handleSignOut}>
                  退出登录
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">{posts.length}</div>
                  <div className="text-sm text-slate-600">发布内容</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {posts.reduce((sum, post) => sum + post.like_count, 0)}
                  </div>
                  <div className="text-sm text-slate-600">获得点赞</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-800">
                    {new Set(posts.map(post => post.target_age)).size}
                  </div>
                  <div className="text-sm text-slate-600">涉及年龄段</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 发布历史 */}
          <Card>
            <CardHeader>
              <CardDescription>
                共{posts.length}条
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPosts ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-800 mx-auto"></div>
                  <p className="mt-2 text-slate-600">加载中...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 mb-4">您还没有发布任何内容</p>
                  <Link href="/">
                    <Button>开始分享智慧</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.map((post) => (
                    <div key={post.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href={`/age/${post.target_age}?highlight=${post.id}`}
                          className="text-slate-600 hover:text-slate-800 text-sm h-6 flex items-center"
                        >
                          查看 →
                        </Link>
                        <Badge variant="secondary" className="text-xs h-6 flex items-center">
                          {post.author_age} 岁
                        </Badge>
                      </div>

                      <p className="text-slate-700 mb-3">
                        <span className="text-slate-500">嗨 {post.target_age}岁，</span>
                        {post.content}
                      </p>

                      <div className={`flex items-center justify-between ${textSecondaryStyles}`}>
                        <div className={cardItemStyles}>
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(post.created_at), 'yyyy年MM月dd日 HH:mm', {
                            locale: zhCN
                          })}
                        </div>
                        <div className={cardItemStyles}>
                          <Heart className="w-4 h-4 mr-1" />
                          {post.like_count}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
