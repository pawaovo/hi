import { Skeleton, PostCardSkeleton } from '@/components/ui/skeleton'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface LoadingProps {
  type?: 'default' | 'card' | 'list' | 'page' | 'posts'
  count?: number
}

export function Loading({ type = 'default', count = 1 }: LoadingProps) {
  const renderSkeleton = () => {
    switch (type) {
      case 'posts':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        )

      case 'card':
        return (
          <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="border rounded-lg p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        )
      
      case 'list':
        return (
          <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'page':
        return (
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/3" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </div>
        )
      
      default:
        return (
          <div className="flex items-center justify-center p-8">
            <LoadingSpinner />
          </div>
        )
    }
  }

  return <div className="w-full">{renderSkeleton()}</div>
}


