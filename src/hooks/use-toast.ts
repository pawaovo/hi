import { useState, useCallback } from 'react'
import { ToastType } from '@/components/ui/toast'

interface ToastItem {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    setToasts(prev => [...prev, { ...toast, id }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'success', title, description, duration })
  }, [addToast])

  const error = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'error', title, description, duration })
  }, [addToast])

  const warning = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'warning', title, description, duration })
  }, [addToast])

  const info = useCallback((title: string, description?: string, duration?: number) => {
    addToast({ type: 'info', title, description, duration })
  }, [addToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearAll
  }
}
