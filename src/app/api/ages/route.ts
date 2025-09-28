import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // 获取年龄统计数据 - 使用优化的聚合查询
    const { data, error } = await supabase
      .from('age_posts')
      .select('target_age')
      .eq('is_active', true)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch age statistics' },
        { status: 500 }
      )
    }

    // 使用Map优化统计逻辑
    const ageStatsMap = new Map<number, number>()

    data.forEach((post: { target_age: number }) => {
      const count = ageStatsMap.get(post.target_age) || 0
      ageStatsMap.set(post.target_age, count + 1)
    })

    // 转换为数组并排序
    const ageStats = Array.from(ageStatsMap.entries())
      .map(([target_age, post_count]) => ({ target_age, post_count }))
      .sort((a, b) => a.target_age - b.target_age)

    return NextResponse.json({ data: ageStats })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
