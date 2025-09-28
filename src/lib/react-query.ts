import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5分钟
      gcTime: 1000 * 60 * 30, // 30分钟
      retry: (failureCount, error: Error & { status?: number }) => {
        // 不重试4xx错误
        if (error?.status && error.status >= 400 && error.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
})

// 查询键工厂
export const queryKeys = {
  // 用户相关
  auth: ['auth'] as const,
  user: (id: string) => ['user', id] as const,
  userPosts: (id: string) => ['user', id, 'posts'] as const,
  userLikes: (id: string) => ['user', id, 'likes'] as const,

  // 内容相关
  posts: (age: number) => ['posts', age] as const,
  post: (id: string) => ['post', id] as const,
  postLikes: (id: string) => ['post', id, 'likes'] as const,

  // 统计相关
  ageStats: ['age-stats'] as const,
  userStats: (id: string) => ['user-stats', id] as const,
  trending: (days: number) => ['trending', days] as const,

  // 搜索相关
  searchPosts: (query: string, age?: number) => ['search', 'posts', query, age] as const,
  searchUsers: (query: string) => ['search', 'users', query] as const,
} as const
