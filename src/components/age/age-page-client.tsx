'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { PostForm } from '@/components/posts/post-form'
import { PostList } from '@/components/posts/post-list'

interface AgePageClientProps {
  age: number
}

function AgePageContent({ age }: AgePageClientProps) {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const searchParams = useSearchParams()
  const highlightPostId = searchParams.get('highlight')

  // 常量定义
  const SCROLL_DELAY = 1000 // 滚动延迟时间（毫秒）
  const HIGHLIGHT_DURATION = 3000 // 高亮持续时间（毫秒）

  // 处理锚点定位
  useEffect(() => {
    if (highlightPostId) {
      // 延迟执行，确保页面内容已加载
      const timer = setTimeout(() => {
        const element = document.getElementById(`post-${highlightPostId}`)
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
          // 添加高亮效果
          element.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50')
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50')
          }, HIGHLIGHT_DURATION)
        }
      }, SCROLL_DELAY)

      return () => clearTimeout(timer)
    }
  }, [highlightPostId, refreshTrigger])

  const handlePostCreated = () => {
    // 触发内容列表刷新
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            嗨 {age}岁
          </h1>
        </div>

        {/* 内容发布表单 */}
        <PostForm
          targetAge={age}
          onPostCreated={handlePostCreated}
        />

        {/* 分割线 */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* 内容列表 */}
        <PostList
          targetAge={age}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </div>
  )
}

export function AgePageClient({ age }: AgePageClientProps) {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mx-auto mb-4"></div>
          </div>
        </div>
      </div>
    }>
      <AgePageContent age={age} />
    </Suspense>
  )
}
