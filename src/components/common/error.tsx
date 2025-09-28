import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface ErrorProps {
  title?: string
  message?: string
  onRetry?: () => void
  variant?: 'default' | 'card' | 'inline'
}

export function Error({ 
  title = '出现错误', 
  message = '加载数据时出现问题，请稍后重试。',
  onRetry,
  variant = 'default'
}: ErrorProps) {
  const content = (
    <div className="text-center">
      <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          重试
        </Button>
      )}
    </div>
  )

  if (variant === 'card') {
    return (
      <Card className="border-destructive/20">
        <CardContent className="p-6">
          {content}
        </CardContent>
      </Card>
    )
  }

  if (variant === 'inline') {
    return (
      <div className="flex items-center space-x-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <Button onClick={onRetry} variant="ghost" size="sm">
            重试
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] p-8">
      {content}
    </div>
  )
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <Error
      title="网络连接错误"
      message="无法连接到服务器，请检查网络连接后重试。"
      onRetry={onRetry}
      variant="card"
    />
  )
}

export function NotFoundError({ message = '请求的内容不存在' }: { message?: string }) {
  return (
    <Error
      title="内容不存在"
      message={message}
      variant="card"
    />
  )
}
