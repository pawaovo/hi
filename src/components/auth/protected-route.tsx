'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { AuthModal } from './auth-modal'
import { Loading } from '@/components/common/loading'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  fallback,
  requireAuth = true 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      setShowAuthModal(true)
    }
  }, [isLoading, requireAuth, isAuthenticated])

  if (isLoading) {
    return <Loading type="page" />
  }

  if (requireAuth && !isAuthenticated) {
    if (fallback) {
      return (
        <>
          {fallback}
          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
            defaultMode="signin"
          />
        </>
      )
    }

    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">需要登录</h2>
        <p className="text-muted-foreground mb-6">
          请登录后继续使用此功能
        </p>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultMode="signin"
        />
      </div>
    )
  }

  return <>{children}</>
}

// 高阶组件版本
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: { requireAuth?: boolean; fallback?: React.ReactNode } = {}
) {
  const { requireAuth = true, fallback } = options

  return function AuthenticatedComponent(props: P) {
    return (
      <ProtectedRoute requireAuth={requireAuth} fallback={fallback}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}
