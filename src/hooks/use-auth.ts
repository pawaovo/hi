import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function useAuth() {
  const { user, isLoading, isAuthenticated, signIn, signUp, signOut } = useAuthStore()

  useEffect(() => {
    // 从localStorage恢复用户状态
    const restoreUserSession = () => {
      try {
        const savedUser = localStorage.getItem('auth-user')
        const userData = savedUser ? JSON.parse(savedUser) : null

        useAuthStore.setState({
          user: userData,
          isAuthenticated: !!userData,
          isLoading: false
        })
      } catch (error) {
        console.error('Error restoring user session:', error)
        useAuthStore.setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        })
      }
    }

    restoreUserSession()
  }, [])

  return {
    user,
    isLoading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
  }
}
