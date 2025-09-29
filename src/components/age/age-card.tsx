'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { AgeCardProps } from '@/types'

// 新的设计 - 参考heyfromthefuture.com

// 默认颜色常量
const DEFAULT_COLORS = {
  text: '#94a3b8',
  textHover: '#1e293b',
  textShadow: '0 0 8px rgba(0,0,0,0.1)'
} as const

// 统一的柔和阴影
const SOFT_SHADOW = '0 2px 8px rgba(0, 0, 0, 0.1)'

// 特殊年龄的配色方案 - 优化后的结构（柔和版本）
const specialAgeStyles: Record<number, {
  primary: string      // 主要颜色（文字和数量）
  hover: string        // 悬停颜色
  border: string       // 边框颜色
}> = {
  7: {
    primary: '#4CAF50',
    hover: '#66BB6A',
    border: 'rgba(57, 255, 20, 0.3)'
  },
  14: {
    primary: '#26C6DA',
    hover: '#4DD0E1',
    border: 'rgba(0, 255, 255, 0.3)'
  },
  21: {
    primary: '#5C6BC0',
    hover: '#7986CB',
    border: 'rgba(25, 25, 112, 0.3)'
  },
  28: {
    primary: '#EC407A',
    hover: '#F06292',
    border: 'rgba(153, 50, 204, 0.3)'
  },
  35: {
    primary: '#AB47BC',
    hover: '#BA68C8',
    border: 'rgba(255, 0, 255, 0.3)'
  },
  42: {
    primary: '#42A5F5',
    hover: '#64B5F6',
    border: 'rgba(0, 0, 255, 0.3)'
  },
  49: {
    primary: '#FFCA28',
    hover: '#FFD54F',
    border: 'rgba(255, 255, 0, 0.3)'
  },
  56: {
    primary: '#EF5350',
    hover: '#E57373',
    border: 'rgba(255, 0, 0, 0.3)'
  },
  63: {
    primary: '#90A4AE',
    hover: '#B0BEC5',
    border: 'rgba(255, 255, 255, 0.4)'
  },
  70: {
    primary: '#FF9800',
    hover: '#FFB74D',
    border: 'rgba(255, 140, 0, 0.3)'
  },
  77: {
    primary: '#26A69A',
    hover: '#4DB6AC',
    border: 'rgba(0, 139, 139, 0.3)'
  },
  84: {
    primary: '#9C27B0',
    hover: '#BA68C8',
    border: 'rgba(186, 85, 211, 0.3)'
  },
  91: {
    primary: '#66BB6A',
    hover: '#81C784',
    border: 'rgba(34, 139, 34, 0.3)'
  }
}

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

  // 获取特殊样式配置
  const specialStyle = specialAgeStyles[age]
  const isSpecialAge = !!specialStyle

  // 优化的事件处理器
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSpecialAge) {
      e.currentTarget.style.color = specialStyle.hover
    } else {
      e.currentTarget.style.color = DEFAULT_COLORS.textHover
    }
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isSpecialAge) {
      e.currentTarget.style.color = specialStyle.primary
    } else {
      e.currentTarget.style.color = DEFAULT_COLORS.text
    }
  }

  return (
    <Link href={`/age/${age}`}>
      <Card
        className={`transition-all duration-300 ease-out hover:shadow-lg cursor-pointer group bg-white/90 backdrop-blur-sm shadow-sm ${
          isSpecialAge ? 'border-2' : 'border-slate-200/60'
        }`}
        style={isSpecialAge ? {
          borderColor: specialStyle.border,
          boxShadow: SOFT_SHADOW
        } : {}}
      >
        <CardContent className="p-6 relative">
          <div className="text-center space-y-2">
            {/* 消息数量 - 右上角数字 */}
            <div
              className="absolute top-3 right-3 text-sm font-semibold"
              style={{
                color: isSpecialAge ? specialStyle.primary : DEFAULT_COLORS.text
              }}
            >
              {postCount > 0 ? postCount : ''}
            </div>

            {/* 年龄数字 */}
            <div className="pt-2">
              <div
                className="text-6xl font-bold transition-colors leading-none group-hover:scale-105 transform transition-transform"
                style={{
                  color: isSpecialAge ? specialStyle.primary : DEFAULT_COLORS.text,
                  textShadow: DEFAULT_COLORS.textShadow
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
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


