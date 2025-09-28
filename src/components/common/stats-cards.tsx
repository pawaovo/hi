'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { type StatItem } from '@/hooks/use-site-stats'

interface StatsCardsProps {
  statItems: StatItem[]
  loading: boolean
  error: string | null
  gridCols?: 'grid-cols-2' | 'grid-cols-2 md:grid-cols-4'
  showError?: boolean
}

export function StatsCards({ 
  statItems, 
  loading, 
  error, 
  gridCols = 'grid-cols-2',
  showError = false 
}: StatsCardsProps) {
  if (loading) {
    return (
      <div className={`grid ${gridCols} gap-4`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6 text-center">
              <LoadingSpinner size="sm" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error && !showError) {
    return null // 静默失败，不显示错误
  }

  if (error && showError) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">加载统计数据失败</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {statItems.map((item, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <item.icon className={`h-8 w-8 ${item.color}`} />
              <div className="text-2xl font-bold text-gray-900">
                {item.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                {item.label}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
