'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { AgeCardProps } from '@/types'

// 新的设计 - 参考heyfromthefuture.com

export function AgeCard({ age, postCount, loading = false }: AgeCardProps) {
  if (loading) {
    return (
      <Card className="transition-all duration-300 ease-out hover:shadow-lg border-slate-200">
        <CardContent className="p-8">
          <div className="text-center space-y-3">
            <Skeleton className="h-10 w-20 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Link href={`/age/${age}`}>
      <Card className="transition-all duration-300 ease-out hover:shadow-lg cursor-pointer group border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6 relative">
          <div className="text-center space-y-2">
            {/* 消息数量 - 右上角数字，灰色字体 */}
            <div className="absolute top-3 right-3 text-sm font-semibold text-slate-400">
              {postCount > 0 ? postCount : ''}
            </div>

            {/* 年龄数字 - 默认灰色，悬停时变深色 */}
            <div className="pt-2">
              <div className="text-6xl font-bold text-slate-400 group-hover:text-slate-800 transition-colors leading-none">
                {age}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function AgeCardSkeleton() {
  return (
    <Card className="border-slate-200/60 bg-white/90 shadow-sm">
      <CardContent className="p-6 relative">
        <div className="text-center space-y-2">
          {/* 消息数量骨架屏 - 与主组件保持一致，右上角 */}
          <div className="absolute top-3 right-3">
            <Skeleton className="h-3 w-4" />
          </div>
          {/* 年龄数字骨架屏 - 移除文字描述部分 */}
          <div className="pt-2">
            <Skeleton className="h-16 w-20 mx-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


