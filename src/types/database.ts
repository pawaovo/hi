// Supabase数据库类型定义
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string | null
          password_hash: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          updated_at: string
          last_login_at: string | null
          is_active: boolean
          is_verified: boolean
        }
        Insert: {
          id?: string
          username: string
          email?: string | null
          password_hash?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          is_verified?: boolean
        }
        Update: {
          id?: string
          username?: string
          email?: string | null
          password_hash?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
          last_login_at?: string | null
          is_active?: boolean
          is_verified?: boolean
        }
      }
      age_posts: {
        Row: {
          id: string
          target_age: number
          content: string
          author_age: number
          user_id: string | null
          username: string | null
          like_count: number
          view_count: number
          created_at: string
          updated_at: string
          is_active: boolean
          is_featured: boolean
        }
        Insert: {
          id?: string
          target_age: number
          content: string
          author_age: number
          user_id?: string | null
          username?: string | null
          like_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_featured?: boolean
        }
        Update: {
          id?: string
          target_age?: number
          content?: string
          author_age?: number
          user_id?: string | null
          username?: string | null
          like_count?: number
          view_count?: number
          created_at?: string
          updated_at?: string
          is_active?: boolean
          is_featured?: boolean
        }
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          refresh_token: string | null
          expires_at: string
          created_at: string
          last_accessed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          refresh_token?: string | null
          expires_at: string
          created_at?: string
          last_accessed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          refresh_token?: string | null
          expires_at?: string
          created_at?: string
          last_accessed_at?: string
        }
      }
      post_views: {
        Row: {
          id: string
          post_id: string
          user_id: string | null
          ip_address: string | null
          user_agent: string | null
          viewed_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string | null
          ip_address?: string | null
          user_agent?: string | null
          viewed_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_age_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          target_age: number
          post_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
