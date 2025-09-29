'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ApiClient } from '@/lib/api-client'
import type { AgePost } from '@/types'

interface PostCardProps {
  post: AgePost
  onUpdate?: (postId: string, updates: Partial<AgePost>) => void
}

export function PostCard({ post, onUpdate }: PostCardProps) {
  const { user, isAuthenticated } = useAuth()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isLiking, setIsLiking] = useState(false)
  const [justLiked, setJustLiked] = useState(false)

  // 获取用户IP地址（用于匿名用户点赞）
  const getUserIP = async () => {
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      return data.ip
    } catch {
      return null
    }
  }

  // 初始化点赞状态
  useEffect(() => {
    const initializeLikeStatus = async () => {
      if (isAuthenticated && user?.id) {
        // 已登录用户：查询真实的点赞状态
        try {
          const liked = await ApiClient.checkLikeStatus(post.id, user.id)
          setIsLiked(liked)
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error checking like status:', error)
          }
          setIsLiked(false)
        }
      } else {
        // 未登录用户：始终显示为未点赞状态（每次页面加载都重置）
        setIsLiked(false)
      }
    }

    initializeLikeStatus()
  }, [post.id, isAuthenticated, user?.id])



  // 处理点赞（只支持添加点赞）
  const handleLike = async () => {
    if (isLiking || isLiked) return // 如果已点赞或正在处理，直接返回

    // 设置加载状态
    setIsLiking(true)

    // 保存原始状态用于回滚
    const originalLikeCount = likeCount
    const originalIsLiked = isLiked

    // 乐观更新：立即更新UI状态
    setIsLiked(true)
    setLikeCount(likeCount + 1)

    // 触发点赞动画
    setJustLiked(true)
    setTimeout(() => setJustLiked(false), 600)

    try {
      // 调用API添加点赞
      const ip = user?.id ? undefined : await getUserIP()
      const result = await ApiClient.addLike(post.id, user?.id, ip)

      if (result.success) {
        // 服务器响应成功，使用服务器返回的准确点赞数
        setLikeCount(result.likeCount)
        onUpdate?.(post.id, { like_count: result.likeCount })
        // 点赞状态保持为true，不再允许重复点赞
      } else {
        // 服务器响应失败，回滚状态
        setIsLiked(originalIsLiked)
        setLikeCount(originalLikeCount)
        onUpdate?.(post.id, { like_count: originalLikeCount })
        // 只在开发环境显示错误
        if (process.env.NODE_ENV === 'development') {
          console.error('Like error:', result.error)
        }
      }
    } catch (error) {
      // 网络错误，回滚状态
      setIsLiked(originalIsLiked)
      setLikeCount(originalLikeCount)
      onUpdate?.(post.id, { like_count: originalLikeCount })
      // 只在开发环境显示错误
      if (process.env.NODE_ENV === 'development') {
        console.error('Error handling like:', error)
      }
    } finally {
      setIsLiking(false)
    }
  }



  return (
    <Card id={`post-${post.id}`} className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        {/* 主要内容区域 - 使用flex布局，响应式设计，内容居中 */}
        <div className="flex items-center justify-between gap-3 sm:gap-4 min-h-[60px]">
          {/* 左侧：消息内容 - 居中对齐，支持自动换行 */}
          <div className="flex-1 text-base sm:text-lg leading-relaxed break-words hyphens-auto overflow-wrap-anywhere">
            <span className="text-gray-500">嗨 {post.target_age}岁，</span>
            <span className="ml-1 inline-block">{post.content}</span>
          </div>

          {/* 右侧：年龄和点赞信息 */}
          <div className="flex flex-col items-center justify-center space-y-2 flex-shrink-0 min-w-[50px] sm:min-w-[60px]">
            {/* 作者年龄 */}
            <div className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
              {post.author_age}岁
            </div>

            {/* 点赞按钮 */}
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              disabled={isLiking || isLiked} // 已点赞或正在处理时禁用
              className={cn(
                "flex items-center space-x-1 transition-all duration-200 min-w-[50px] sm:min-w-[60px] h-8 px-2 sm:px-3",
                justLiked && "animate-pulse scale-110",
                isLiked && "cursor-not-allowed opacity-75" // 已点赞时的视觉反馈
              )}
            >
              <Heart
                className={cn(
                  "h-3 w-3 sm:h-4 sm:w-4 transition-all duration-200",
                  isLiked ? 'fill-current text-red-500' : '',
                  justLiked && "animate-bounce"
                )}
              />
              <span className={cn(
                "text-xs sm:text-sm transition-all duration-200",
                justLiked && "font-bold"
              )}>
                {likeCount}
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
