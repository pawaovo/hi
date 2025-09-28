import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// 获取指定用户的发布历史
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // 获取用户发布的内容
    const { data: posts, error: postsError, count } = await supabase
      .from('age_posts')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (postsError) {
      console.error('Database error:', postsError)
      return NextResponse.json(
        { error: 'Failed to fetch user posts' },
        { status: 500 }
      )
    }

    // 获取用户统计信息
    const { data: stats, error: statsError } = await supabase
      .from('age_posts')
      .select('like_count')
      .eq('user_id', userId)
      .eq('is_active', true)

    let totalLikes = 0
    if (!statsError && stats) {
      totalLikes = stats.reduce((sum, post) => sum + post.like_count, 0)
    }

    return NextResponse.json({
      data: {
        posts: posts || [],
        stats: {
          total_posts: count || 0,
          total_likes: totalLikes
        }
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
        has_next: (count || 0) > offset + limit,
        has_prev: page > 1
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
