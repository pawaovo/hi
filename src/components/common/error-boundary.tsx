'use client'

import React, { Component, ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              <span>出现错误</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              抱歉，页面出现了错误。请尝试刷新页面或稍后再试。
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-xs bg-muted p-2 rounded">
                <summary className="cursor-pointer">错误详情</summary>
                <pre className="mt-2 whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex space-x-2">
              <Button onClick={this.handleReset} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                重试
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="default" 
                size="sm"
              >
                刷新页面
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }

    return this.props.children
  }
}

// 简单的错误显示组件
interface ErrorDisplayProps {
  error: string
  onRetry?: () => void
  className?: string
}

export function ErrorDisplay({ error, onRetry, className }: ErrorDisplayProps) {
  return (
    <div className={`text-center p-6 bg-destructive/10 rounded-lg ${className || ''}`}>
      <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
      <p className="text-destructive font-medium mb-2">出现错误</p>
      <p className="text-sm text-muted-foreground mb-4">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          重试
        </Button>
      )}
    </div>
  )
}

// 网络错误组件
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="网络连接失败，请检查网络连接后重试"
      onRetry={onRetry}
    />
  )
}

// 数据加载错误组件
export function DataLoadError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorDisplay
      error="数据加载失败，请稍后重试"
      onRetry={onRetry}
    />
  )
}
