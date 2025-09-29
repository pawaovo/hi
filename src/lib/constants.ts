// =====================================================
// 应用常量定义
// =====================================================

// 年龄相关常量
export const AGE_LIMITS = {
  MIN: 7,
  MAX: 91,
  TOTAL: 85 // 91 - 7 + 1
} as const

// 首页展示的主要年龄段
export const FEATURED_AGES = [18, 25, 30, 35, 40, 50] as const

// 分页相关常量
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_AGE_GRID_SIZE: 6
} as const

// 内容限制
export const CONTENT_LIMITS = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 500,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 50
} as const

// 注意：项目已迁移到直接使用Supabase客户端，不再使用API路由

// 缓存相关常量
export const CACHE_KEYS = {
  AGE_STATS: 'age-stats',
  USER_POSTS: 'user-posts',
  AGE_POSTS: 'age-posts'
} as const

// 时间相关常量
export const TIME_CONSTANTS = {
  CACHE_TTL: 5 * 60 * 1000, // 5分钟
  DEBOUNCE_DELAY: 300, // 300ms
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000 // 24小时
} as const

// 响应式断点
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
} as const

// 网格布局配置
export const GRID_CONFIGS = {
  HOME: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 max-w-2xl mx-auto',
  ALL_AGES: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 max-w-4xl mx-auto'
} as const

// 生成年龄范围的工具函数
export const generateAgeRange = (min = AGE_LIMITS.MIN, max = AGE_LIMITS.MAX): number[] => {
  const ages = []
  for (let age = min; age <= max; age++) {
    ages.push(age)
  }
  return ages
}

// 验证年龄是否在有效范围内
export const isValidAge = (age: number): boolean => {
  return Number.isInteger(age) && age >= AGE_LIMITS.MIN && age <= AGE_LIMITS.MAX
}

// 格式化消息数量显示
export const formatPostCount = (count: number): string => {
  return count > 0 ? `${count} 条消息` : '暂无消息'
}
