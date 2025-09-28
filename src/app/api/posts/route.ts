import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isValidAge } from '@/lib/constants'

// 获取指定年龄的内容列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const targetAge = searchParams.get('target_age')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    if (!targetAge || !isValidAge(parseInt(targetAge))) {
      return NextResponse.json(
        { error: 'Invalid target age' },
        { status: 400 }
      )
    }

    // 获取指定年龄的内容，按点赞数和创建时间排序
    const { data, error, count } = await supabase
      .from('age_posts')
      .select('*', { count: 'exact' })
      .eq('target_age', parseInt(targetAge))
      .eq('is_active', true)
      .order('like_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        hasMore: (count || 0) > offset + limit
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

// 创建新内容
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { target_age, content, author_age, user_id, username } = body

    // 验证必填字段
    if (!target_age || !content || !author_age) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // 验证年龄范围
    if (!isValidAge(target_age) || !isValidAge(author_age)) {
      return NextResponse.json(
        { error: 'Invalid age range' },
        { status: 400 }
      )
    }

    // 验证内容长度
    if (content.length < 1 || content.length > 500) {
      return NextResponse.json(
        { error: 'Content length must be between 1 and 500 characters' },
        { status: 400 }
      )
    }

    // 创建内容记录
    const { data, error } = await supabase
      .from('age_posts')
      .insert({
        target_age,
        content: content.trim(),
        author_age,
        user_id: user_id || null,
        username: username || null,
        like_count: 0,
        view_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true,
        is_featured: false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
