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

  // 私有方法：构建已登录用户点赞查询
  private static buildUserLikeQuery(postId: string, userId: string) {
    return supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
  }

  // 点赞（只支持添加点赞，不支持取消）
  static async addLike(
    postId: string,
    userId?: string,
    ipAddress?: string
  ): Promise<{ success: boolean; likeCount: number; error?: string }> {
    try {
      // 已登录用户：检查是否已点赞并保存记录
      if (userId) {
        const { data: existingLike, error: checkError } = await this.buildUserLikeQuery(postId, userId).single()

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError
        }

        if (existingLike) {
          return {
            success: false,
            likeCount: 0,
            error: '您已经点赞过这条消息了'
          }
        }

        // 插入点赞记录（已登录用户）
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert([{
            post_id: postId,
            user_id: userId,
            ip_address: ipAddress,
            user_agent: navigator.userAgent
          }])

        if (insertError) throw insertError
      }

      // 获取当前点赞数并手动更新（确保数据一致性）
      const { data: currentPost, error: selectError } = await supabase
        .from('age_posts')
        .select('like_count')
        .eq('id', postId)
        .single()

      if (selectError) throw selectError

      const newLikeCount = (currentPost.like_count || 0) + 1

      // 手动更新点赞计数
      const { data: updatedPost, error: updateError } = await supabase
        .from('age_posts')
        .update({
          like_count: newLikeCount,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .select('like_count')
        .single()

      if (updateError) throw updateError

      return {
        success: true,
        likeCount: updatedPost.like_count
      }
    } catch (error: unknown) {
      return {
        success: false,
        likeCount: 0,
        error: error instanceof Error ? error.message : '点赞失败'
      }
    }
  }

  // 检查点赞状态
  static async checkLikeStatus(
    postId: string,
    userId?: string
  ): Promise<boolean> {
    // 未登录用户始终返回false（允许重复点赞）
    if (!userId) {
      return false
    }

    try {
      // 已登录用户检查数据库记录
      const { data } = await this.buildUserLikeQuery(postId, userId).single()
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
    active_user_groups: Array<{ ageRange: string; userCount: number }>
  }> {
    try {
      const [postsResult, usersResult, likesResult, authorAgesResult] = await Promise.all([
        supabase.from('age_posts').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        // 修复：获取所有帖子的like_count来计算总和
        supabase.from('age_posts').select('like_count'),
        // 获取所有发帖用户的年龄用于活跃用户统计
        supabase.from('age_posts').select('author_age').not('author_age', 'is', null)
      ])

      // 计算总点赞数（所有帖子的like_count总和）
      const totalLikes = likesResult.data?.reduce((sum, post) => sum + (post.like_count || 0), 0) || 0

      // 计算活跃用户年龄段分布
      const ageGroups: Record<string, Set<number>> = {}

      authorAgesResult.data?.forEach((post) => {
        const age = post.author_age
        if (age && age >= 7 && age <= 91) {
          // 计算年龄段 (7-14, 14-21, 21-28, ...)
          const groupStart = Math.floor((age - 7) / 7) * 7 + 7
          const groupEnd = groupStart + 7
          const ageRange = `${groupStart}-${groupEnd}`

          if (!ageGroups[ageRange]) {
            ageGroups[ageRange] = new Set()
          }
          ageGroups[ageRange].add(age)
        }
      })

      // 转换为数组并按用户数排序，取前3名
      const activeUserGroups = Object.entries(ageGroups)
        .map(([ageRange, ages]) => ({
          ageRange,
          userCount: ages.size
        }))
        .sort((a, b) => b.userCount - a.userCount)
        .slice(0, 3)

      return {
        total_posts: postsResult.count || 0,
        total_users: usersResult.count || 0,
        total_likes: totalLikes,
        active_user_groups: activeUserGroups
      }
    } catch (error) {
      console.error('Error fetching site stats:', error)
      return {
        total_posts: 0,
        total_users: 0,
        total_likes: 0,
        active_user_groups: []
      }
    }
  }
}
