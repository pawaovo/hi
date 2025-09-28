// 重新导出数据库类型，避免重复定义
import type { Database } from './database'
export type { Database } from './database'

// 从数据库类型中提取应用层类型
export type User = Database['public']['Tables']['users']['Row']
export type AgePost = Database['public']['Tables']['age_posts']['Row'] & {
  is_liked?: boolean; // 当前用户是否已点赞
}
export type PostLike = Database['public']['Tables']['post_likes']['Row']
export type UserSession = Database['public']['Tables']['user_sessions']['Row']
export type PostView = Database['public']['Tables']['post_views']['Row']

// 组件Props类型
export interface AgeCardProps {
  age: number;
  postCount: number;
  loading?: boolean;
}

export interface AgeGridProps {
  showAll?: boolean;
  maxItems?: number;
}

// API响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  message?: string;
}

// 分页类型
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// 内容列表响应类型
export interface PostsResponse {
  posts: AgePost[];
  pagination: Pagination;
}

// 年龄统计类型
export interface AgeStats {
  age_counts: Record<number, number>;
  total_posts: number;
  total_users: number;
}

// 用户统计类型
export interface UserStats {
  posts_count: number;
  likes_received: number;
  likes_given: number;
  joined_date: string;
}

// 表单类型
export interface LoginFormData {
  username: string;
  password: string;
}

export interface RegisterFormData {
  username: string;
  email?: string;
  password: string;
  confirmPassword: string;
}

export interface PostFormData {
  content: string;
  authorAge: number;
}

export interface ProfileFormData {
  bio?: string;
  avatar_url?: string;
}

// 搜索类型
export interface SearchParams {
  q: string;
  age?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse<T> {
  results: T[];
  pagination: Pagination;
  query: string;
}

// 错误类型
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}



export interface PostCardProps {
  post: AgePost;
  onLike?: (postId: string) => void;
  onView?: (postId: string) => void;
}

export interface PostFormProps {
  targetAge: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onAnonymousPost?: () => void;
  canAnonymousPost?: boolean;
}

// 状态管理类型
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface PostsState {
  posts: AgePost[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

// 配置类型
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    twitter: string;
  };
}

// 数据库枚举类型
export type PostSortOrder = 'likes' | 'latest' | 'oldest';
export type UserRole = 'user' | 'admin' | 'moderator';
export type PostStatus = 'active' | 'inactive' | 'pending' | 'rejected';

// 工具类型
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
