import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  title: string
  description?: string
  duration?: number
  onClose?: () => void
  className?: string
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info
}

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800'
}

const iconStyles = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400'
}

export function Toast({ 
  type, 
  title, 
  description, 
  duration = 5000, 
  onClose,
  className 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  const Icon = toastIcons[type]

  const handleClose = useCallback(() => {
    setIsLeaving(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 300) // 动画持续时间
  }, [onClose])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm w-full',
        'transform transition-all duration-300 ease-in-out',
        isLeaving 
          ? 'translate-x-full opacity-0' 
          : 'translate-x-0 opacity-100',
        className
      )}
    >
      <div
        className={cn(
          'rounded-lg border p-4 shadow-lg',
          'animate-in slide-in-from-right-full',
          toastStyles[type]
        )}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('h-5 w-5', iconStyles[type])} />
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {description && (
              <p className="mt-1 text-sm opacity-90">{description}</p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={handleClose}
              className="inline-flex rounded-md p-1.5 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Toast 容器组件
interface ToastContainerProps {
  toasts: Array<{
    id: string
    type: ToastType
    title: string
    description?: string
    duration?: number
  }>
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          title={toast.title}
          description={toast.description}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}
