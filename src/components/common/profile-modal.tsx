'use client'

import { useEffect, useState, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Heart, MessageSquare, Calendar, User, LogOut } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Post {
  id: string
  target_age: number
  content: string
  author_age: number
  like_count: number
  created_at: string
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user, signOut } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(true)
  const router = useRouter()

  const fetchUserPosts = useCallback(async () => {
    if (!user?.id) {
      setIsLoadingPosts(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('age_posts')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user posts:', error)
      } else {
        setPosts(data || [])
      }
    } catch (error) {
      console.error('Error fetching user posts:', error)
    } finally {
      setIsLoadingPosts(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (open && user?.id) {
      setIsLoadingPosts(true)
      fetchUserPosts()
    }
  }, [open, user?.id, fetchUserPosts])

  const handleSignOut = async () => {
    await signOut()
    onOpenChange(false)
    router.push('/')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">
            我的账户
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* 用户信息卡片 */}
          <Card>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出登录
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* 发布历史 */}
          <Card>
            <CardHeader>
              <CardTitle>我的发布</CardTitle>
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
                  <Button asChild>
                    <Link href="/" onClick={() => onOpenChange(false)}>开始分享智慧</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  {posts.map((post) => (
                    <div key={post.id} className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-slate-100">
                            {post.author_age}岁
                          </Badge>
                          <span className="text-slate-600">→</span>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {post.target_age}岁
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.like_count}
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 mb-3 line-clamp-3">{post.content}</p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>
                          {format(new Date(post.created_at), 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}
                        </span>
                        <Link 
                          href={`/age/${post.target_age}`}
                          className="text-slate-600 hover:text-slate-800 hover:underline"
                          onClick={() => onOpenChange(false)}
                        >
                          查看详情 →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

