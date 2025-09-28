import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

// 点赞/取消点赞
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: postId } = await params
    const body = await request.json()
    const { user_id, ip_address, user_agent } = body

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    // 检查内容是否存在
    const { data: post, error: postError } = await supabase
      .from('age_posts')
      .select('id, like_count')
      .eq('id', postId)
      .eq('is_active', true)
      .single()

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // 检查是否已经点赞过
    let existingLike = null
    if (user_id) {
      // 登录用户：检查用户ID
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user_id)
        .single()
      existingLike = data
    } else if (ip_address) {
      // 匿名用户：检查IP地址（24小时内）
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('ip_address', ip_address)
        .gte('created_at', twentyFourHoursAgo)
        .single()
      existingLike = data
    }

    if (existingLike) {
      // 已经点赞过，执行取消点赞
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id)

      if (deleteError) {
        console.error('Error removing like:', deleteError)
        return NextResponse.json(
          { error: 'Failed to remove like' },
          { status: 500 }
        )
      }

      // 更新点赞数（减1）
      const { error: updateError } = await supabase
        .from('age_posts')
        .update({ 
          like_count: Math.max(0, post.like_count - 1),
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      if (updateError) {
        console.error('Error updating like count:', updateError)
        return NextResponse.json(
          { error: 'Failed to update like count' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        liked: false, 
        like_count: Math.max(0, post.like_count - 1)
      })
    } else {
      // 没有点赞过，执行点赞
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: user_id || null,
          ip_address: ip_address || null,
          user_agent: user_agent || null,
          created_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error adding like:', insertError)
        return NextResponse.json(
          { error: 'Failed to add like' },
          { status: 500 }
        )
      }

      // 更新点赞数（加1）
      const { error: updateError } = await supabase
        .from('age_posts')
        .update({ 
          like_count: post.like_count + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)

      if (updateError) {
        console.error('Error updating like count:', updateError)
        return NextResponse.json(
          { error: 'Failed to update like count' },
          { status: 500 }
        )
      }

      return NextResponse.json({ 
        liked: true, 
        like_count: post.like_count + 1
      })
    }
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 获取点赞状态
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id: postId } = await params
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const ipAddress = searchParams.get('ip_address')

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      )
    }

    let isLiked = false

    if (userId) {
      // 登录用户：检查用户ID
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single()
      isLiked = !!data
    } else if (ipAddress) {
      // 匿名用户：检查IP地址（24小时内）
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('ip_address', ipAddress)
        .gte('created_at', twentyFourHoursAgo)
        .single()
      isLiked = !!data
    }

    return NextResponse.json({ liked: isLiked })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
