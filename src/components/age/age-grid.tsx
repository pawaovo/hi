'use client'

import { useMemo, memo, useState } from 'react'
import { AgeCard } from './age-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { generateAgeRange, FEATURED_AGES } from '@/lib/constants'
import { useAgeStats } from '@/hooks/use-age-stats'
import type { AgeGridProps } from '@/types'

type SortType = 'age' | 'count'

export const AgeGrid = memo(function AgeGrid({ showAll = false, maxItems = 6 }: AgeGridProps) {
  const { ageStats, loading, error } = useAgeStats()
  const [sortType, setSortType] = useState<SortType>('age')

  // 使用常量和工具函数优化年龄范围生成
  const allAges = useMemo(() => generateAgeRange(), [])

  // 使用Map优化查找性能和排序逻辑
  const { ageStatsMap, displayAges } = useMemo(() => {
    // 创建统计数据映射
    const statsMap = new Map<number, number>()
    ageStats.forEach(stat => {
      statsMap.set(stat.target_age, stat.post_count)
    })

    // 获取要显示的年龄列表
    const ages = showAll ? allAges : FEATURED_AGES.slice(0, maxItems)

    // 排序逻辑
    const sortedAges = sortType === 'age'
      ? [...ages].sort((a, b) => a - b)
      : [...ages].sort((a, b) => {
          const countA = statsMap.get(a) || 0
          const countB = statsMap.get(b) || 0
          return countB - countA // 从多到少
        })

    return {
      ageStatsMap: statsMap,
      displayAges: sortedAges
    }
  }, [ageStats, showAll, allAges, maxItems, sortType])

  // 获取年龄对应的帖子数量
  const getPostCount = (age: number) => ageStatsMap.get(age) || 0

  if (error) {
    return (
      <div className="text-center p-6 bg-destructive/10 rounded-lg">
        <p className="text-destructive">数据加载失败: {error}</p>
        <p className="text-sm text-muted-foreground mt-2">
          请刷新页面重试
        </p>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* 排序选择器和年龄卡片网格的容器 - 确保对齐 */}
      <div className={`${showAll ? 'max-w-4xl mx-auto' : 'max-w-2xl mx-auto'}`}>
        {/* 引导文字和排序选择器 - 左右对齐 */}
        {showAll && (
          <div className="flex justify-between items-center mb-6">
            <span className="text-slate-600 font-medium">点开年龄，进去看看</span>
            <Select value={sortType} onValueChange={(value: SortType) => setSortType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="age">按年龄排序</SelectItem>
                <SelectItem value="count">按消息数排序</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* 年龄卡片网格 */}
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-3">
          {displayAges.map((age) => (
            <AgeCard
              key={age}
              age={age}
              postCount={getPostCount(age)}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </div>
  )
})
