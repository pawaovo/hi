import { MessageSquare, Users, Heart, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyProps {
  icon?: 'message' | 'users' | 'heart' | 'search' | React.ReactNode
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  variant?: 'default' | 'compact'
}

export function Empty({ 
  icon = 'message',
  title = '暂无内容',
  description = '这里还没有任何内容',
  action,
  variant = 'default'
}: EmptyProps) {
  const getIcon = () => {
    if (typeof icon === 'string') {
      const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
        message: MessageSquare,
        users: Users,
        heart: Heart,
        search: Search
      }
      const IconComponent = iconMap[icon]
      if (IconComponent) {
        return <IconComponent className="h-12 w-12 text-muted-foreground" />
      }
      return <MessageSquare className="h-12 w-12 text-muted-foreground" />
    }
    return icon
  }

  const isCompact = variant === 'compact'

  return (
    <div className={`text-center ${isCompact ? 'py-8' : 'py-12'}`}>
      <div className={`mx-auto ${isCompact ? 'mb-3' : 'mb-6'}`}>
        {getIcon()}
      </div>
      <h3 className={`font-semibold text-foreground ${isCompact ? 'text-base mb-1' : 'text-lg mb-2'}`}>
        {title}
      </h3>
      <p className={`text-muted-foreground ${isCompact ? 'text-sm mb-3' : 'mb-4'}`}>
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} variant="outline" size={isCompact ? 'sm' : 'default'}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

export function EmptyPosts({ age, onCreatePost }: { age?: number, onCreatePost?: () => void }) {
  return (
    <Empty
      icon="message"
      title={age ? `${age}岁还没有智慧分享` : '暂无智慧分享'}
      description={age ? `成为第一个为${age}岁分享智慧的人吧！` : '还没有人分享智慧，快来成为第一个吧！'}
      action={onCreatePost ? {
        label: '分享智慧',
        onClick: onCreatePost
      } : undefined}
    />
  )
}

export function EmptySearch({ query, onClear }: { query?: string, onClear?: () => void }) {
  return (
    <Empty
      icon="search"
      title="没有找到相关内容"
      description={query ? `没有找到与"${query}"相关的内容` : '请尝试其他搜索词'}
      action={onClear ? {
        label: '清除搜索',
        onClick: onClear
      } : undefined}
      variant="compact"
    />
  )
}

export function EmptyLikes({ onExplore }: { onExplore?: () => void }) {
  return (
    <Empty
      icon="heart"
      title="还没有点赞的内容"
      description="去发现一些有趣的智慧分享吧！"
      action={onExplore ? {
        label: '去探索',
        onClick: onExplore
      } : undefined}
    />
  )
}
