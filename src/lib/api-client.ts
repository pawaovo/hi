import { supabase } from './supabase'
import type { AgePost, PostsResponse, Pagination } from '@/types'

// 客户端 API 函数，直接调用 Supabase
export class ApiClient {
  // 获取年龄统计
  static async getAgeStats(): Promise<Record<number, number>> {
    try {
      const { data, error } = await supabase
        .from('age_posts')
        .select('target_age')
        .eq('is_active', true)

      if (error) {
        console.error('Database error:', error)
        return {}
      }

      // 统计每个年龄的内容数量
      const ageCounts: Record<number, number> = {}
      data?.forEach((post: { target_age: number }) => {
        ageCounts[post.target_age] = (ageCounts[post.target_age] || 0) + 1
      })

      return ageCounts
    } catch (error) {
      console.error('Error fetching age stats:', error)
      return {}
    }
  }

  // 获取指定年龄的内容列表
  static async getPostsByAge(
    age: number, 
    page: number = 1, 
    limit: number = 20
  ): Promise<PostsResponse> {
    try {
      const offset = (page - 1) * limit

      // 获取总数
      const { count } = await supabase
        .from('age_posts')
        .select('*', { count: 'exact', head: true })
        .eq('target_age', age)
        .eq('is_active', true)

      // 获取分页数据
      const { data, error } = await supabase
        .from('age_posts')
        .select('*')
        .eq('target_age', age)
        .eq('is_active', true)
        .order('like_count', { ascending: false })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        throw error
      }

      const total = count || 0
      const totalPages = Math.ceil(total / limit)

      const pagination: Pagination = {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }

      return {
        posts: data || [],
        pagination
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
      return {
        posts: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          total_pages: 0,
          has_next: false,
          has_prev: false
        }
      }
    }
  }

  // 创建新内容
  static async createPost(data: {
    target_age: number
    content: string
    author_age: number
    user_id?: string
    username?: string
  }): Promise<{ success: boolean; data?: AgePost; error?: string }> {
    try {
      const { data: newPost, error } = await supabase
        .from('age_posts')
        .insert([data])
        .select()
        .single()

      if (error) {
        throw error
      }

      return { success: true, data: newPost }
    } catch (error: unknown) {
      console.error('Error creating post:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建内容失败'
      }
    }
  }

  // 点赞/取消点赞
  static async toggleLike(
    postId: string, 
    userId?: string, 
    ipAddress?: string
  ): Promise<{ success: boolean; liked: boolean; error?: string }> {
    try {
      // 检查是否已点赞
      let query = supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)

      if (userId) {
        query = query.eq('user_id', userId)
      } else if (ipAddress) {
        query = query.eq('ip_address', ipAddress)
      }

      const { data: existingLike } = await query.single()

      if (existingLike) {
        // 取消点赞
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('id', existingLike.id)

        if (error) throw error
        return { success: true, liked: false }
      } else {
        // 添加点赞
        const { error } = await supabase
          .from('post_likes')
          .insert([{
            post_id: postId,
            user_id: userId,
            ip_address: ipAddress,
            user_agent: navigator.userAgent
          }])

        if (error) throw error
        return { success: true, liked: true }
      }
    } catch (error: unknown) {
      console.error('Error toggling like:', error)
      return {
        success: false,
        liked: false,
        error: error instanceof Error ? error.message : '操作失败'
      }
    }
  }

  // 检查点赞状态
  static async checkLikeStatus(
    postId: string, 
    userId?: string, 
    ipAddress?: string
  ): Promise<boolean> {
    try {
      let query = supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)

      if (userId) {
        query = query.eq('user_id', userId)
      } else if (ipAddress) {
        query = query.eq('ip_address', ipAddress)
      }

      const { data } = await query.single()
      return !!data
    } catch {
      return false
    }
  }

  // 获取网站统计
  static async getSiteStats(): Promise<{
    total_posts: number
    total_users: number
    total_likes: number
  }> {
    try {
      const [postsResult, usersResult, likesResult] = await Promise.all([
        supabase.from('age_posts').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('post_likes').select('id', { count: 'exact', head: true })
      ])

      return {
        total_posts: postsResult.count || 0,
        total_users: usersResult.count || 0,
        total_likes: likesResult.count || 0
      }
    } catch (error) {
      console.error('Error fetching site stats:', error)
      return {
        total_posts: 0,
        total_users: 0,
        total_likes: 0
      }
    }
  }
}
