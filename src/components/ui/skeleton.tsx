import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// 预定义的骨架屏组件
export function PostCardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      {/* 内容区域 */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>

      {/* 元数据区域 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-8 rounded-full" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <Skeleton className="h-8 w-16 rounded-md" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-24 w-full rounded-md" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <div className="flex space-x-3">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </div>
    </div>
  )
}

export { Skeleton }
