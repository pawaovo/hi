import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取网站基础统计信息
export async function GET() {
  try {
    // 获取总发布数
    const { count: totalPosts, error: postsError } = await supabase
      .from('age_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (postsError) {
      console.error('Error fetching posts count:', postsError)
    }

    // 获取总用户数
    const { count: totalUsers, error: usersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    if (usersError) {
      console.error('Error fetching users count:', usersError)
    }

    // 获取总点赞数
    const { data: likesData, error: likesError } = await supabase
      .from('age_posts')
      .select('like_count')
      .eq('is_active', true)

    let totalLikes = 0
    if (!likesError && likesData) {
      totalLikes = likesData.reduce((sum, post) => sum + post.like_count, 0)
    }

    // 获取活跃年龄段数（有内容的年龄段）
    const { data: agesData, error: agesError } = await supabase
      .from('age_posts')
      .select('target_age')
      .eq('is_active', true)

    let activeAges = 0
    if (!agesError && agesData) {
      const uniqueAges = new Set(agesData.map(post => post.target_age))
      activeAges = uniqueAges.size
    }

    return NextResponse.json({
      data: {
        total_posts: totalPosts || 0,
        total_users: totalUsers || 0,
        total_likes: totalLikes,
        active_ages: activeAges
      }
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
