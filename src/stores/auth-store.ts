import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

interface SignUpData {
  username: string
  password: string
}

interface SignInData {
  username: string
  password: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean

  // Actions
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  updateUser: (updates: Partial<User>) => void
  signUp: (data: SignUpData) => Promise<{ data: User | null; error: { message: string } | null }>
  signIn: (data: SignInData) => Promise<{ data: User | null; error: { message: string } | null }>
  signOut: () => Promise<{ error: { message: string } | null }>
}

// 辅助函数：保存用户到localStorage
const saveUserToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('auth-user', JSON.stringify(user))
  } else {
    localStorage.removeItem('auth-user')
  }
}

// 辅助函数：创建完整的用户数据对象
const createUserData = (baseData: { id: string; username: string; created_at: string; password_hash?: string | null }): User => ({
  id: baseData.id,
  username: baseData.username,
  email: null,
  password_hash: baseData.password_hash || null,
  avatar_url: null,
  bio: null,
  created_at: baseData.created_at,
  updated_at: baseData.created_at,
  last_login_at: new Date().toISOString(),
  is_active: true,
  is_verified: true
})

export const useAuthStore = create<AuthState>()((set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      logout: () => set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      }),

      updateUser: (updates) => {
        const currentUser = get().user
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates }
          })
        }
      },

      signUp: async ({ username, password }) => {
        set({ isLoading: true })

        try {
          // 1. 检查用户名是否已存在
          const { data: existingUser, error: checkError } = await supabase
            .from('users')
            .select('username')
            .eq('username', username)
            .single()

          if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 是 "not found" 错误，这是我们期望的
            set({ isLoading: false })
            return { data: null, error: { message: '检查用户名时发生错误' } }
          }

          if (existingUser) {
            set({ isLoading: false })
            return { data: null, error: { message: '用户名已存在，请选择其他用户名' } }
          }

          // 2. 创建新用户记录
          const userId = crypto.randomUUID()
          const { error } = await supabase
            .from('users')
            .insert({
              id: userId,
              username,
              password_hash: password, // 在实际应用中应该加密密码
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              is_active: true,
              is_verified: true
            })
            .select()
            .single()

          if (error) {
            set({ isLoading: false })
            return { data: null, error: { message: '注册失败，请重试' } }
          }

          // 3. 设置用户状态并保存到localStorage
          const userData = createUserData({
            id: userId,
            username,
            created_at: new Date().toISOString()
          })

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false
          })

          saveUserToStorage(userData)
          return { data: userData, error: null }
        } catch (error) {
          console.error('Sign up error:', error)
          set({ isLoading: false })
          return { data: null, error: { message: '注册失败，请重试' } }
        }
      },

      signIn: async ({ username, password }) => {
        set({ isLoading: true })

        try {
          // 查找用户并验证密码
          const { data: user, error } = await supabase
            .from('users')
            .select('id, username, password_hash, created_at')
            .eq('username', username)
            .eq('password_hash', password) // 在实际应用中应该使用加密密码比较
            .eq('is_active', true)
            .single()

          if (error || !user) {
            set({ isLoading: false })
            return { data: null, error: { message: '用户名或密码错误' } }
          }

          // 设置用户状态并保存到localStorage
          const userData = createUserData({
            id: user.id,
            username: user.username,
            created_at: user.created_at,
            password_hash: user.password_hash
          })

          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false
          })

          saveUserToStorage(userData)
          return { data: userData, error: null }
        } catch (error) {
          console.error('Sign in error:', error)
          set({ isLoading: false })
          return { data: null, error: { message: '登录失败，请重试' } }
        }
      },

      signOut: async () => {
        set({ isLoading: true })

        try {
          // 清除状态和localStorage
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          })

          saveUserToStorage(null)
          return { error: null }
        } catch (error) {
          console.error('Sign out error:', error)
          set({ isLoading: false })
          return { error: { message: '登出失败' } }
        }
      }
    }))
