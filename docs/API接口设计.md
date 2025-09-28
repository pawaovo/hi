# API接口设计文档

## 概述

本文档详细描述了中文版年龄主题内容分享网站的API接口设计，包括认证、内容管理、用户管理等核心功能的接口规范。

## 基础信息

### 基础URL
- 开发环境：`http://localhost:3000/api`
- 生产环境：`https://your-domain.com/api`

### 认证方式
- Bearer Token认证
- 基于Supabase JWT Token

### 响应格式
所有API响应都采用统一的JSON格式：

```typescript
// 成功响应
{
  "success": true,
  "data": any,
  "message"?: string
}

// 错误响应
{
  "success": false,
  "error": {
    "code": string,
    "message": string,
    "details"?: any
  }
}
```

### 状态码规范
- `200` - 请求成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `429` - 请求过于频繁
- `500` - 服务器内部错误

## 认证相关接口

### 1. 用户注册
```
POST /api/auth/register
```

**请求体：**
```json
{
  "username": "string (3-50字符)",
  "email": "string (可选)",
  "password": "string (6-100字符)"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "created_at": "timestamp"
    },
    "session": {
      "access_token": "string",
      "refresh_token": "string",
      "expires_at": "timestamp"
    }
  }
}
```

### 2. 用户登录
```
POST /api/auth/login
```

**请求体：**
```json
{
  "username": "string",
  "password": "string"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "last_login_at": "timestamp"
    },
    "session": {
      "access_token": "string",
      "refresh_token": "string",
      "expires_at": "timestamp"
    }
  }
}
```

### 3. 刷新Token
```
POST /api/auth/refresh
```

**请求体：**
```json
{
  "refresh_token": "string"
}
```

### 4. 用户登出
```
POST /api/auth/logout
Authorization: Bearer <access_token>
```

### 5. 获取当前用户信息
```
GET /api/auth/me
Authorization: Bearer <access_token>
```

## 内容相关接口

### 1. 获取年龄内容列表
```
GET /api/posts?age={age}&page={page}&limit={limit}&sort={sort}
```

**查询参数：**
- `age` (required): 目标年龄 (7-91)
- `page` (optional): 页码，默认1
- `limit` (optional): 每页数量，默认20，最大100
- `sort` (optional): 排序方式，可选值：`likes`(默认)、`latest`、`oldest`

**响应：**
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "target_age": 18,
        "content": "string",
        "author_age": 25,
        "username": "string",
        "like_count": 42,
        "view_count": 156,
        "created_at": "timestamp",
        "is_liked": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "total_pages": 5,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

### 2. 创建内容
```
POST /api/posts
Authorization: Bearer <access_token> (可选，支持匿名发布)
```

**请求体：**
```json
{
  "target_age": 18,
  "content": "string (1-1000字符)",
  "author_age": 25
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "target_age": 18,
    "content": "string",
    "author_age": 25,
    "username": "string",
    "like_count": 0,
    "view_count": 0,
    "created_at": "timestamp"
  }
}
```

### 3. 获取单个内容详情
```
GET /api/posts/{id}
```

### 4. 更新内容（仅作者可操作）
```
PUT /api/posts/{id}
Authorization: Bearer <access_token>
```

**请求体：**
```json
{
  "content": "string (1-1000字符)"
}
```

### 5. 删除内容（仅作者可操作）
```
DELETE /api/posts/{id}
Authorization: Bearer <access_token>
```

## 点赞相关接口

### 1. 点赞内容
```
POST /api/posts/{id}/like
Authorization: Bearer <access_token> (可选)
```

**响应：**
```json
{
  "success": true,
  "data": {
    "liked": true,
    "like_count": 43
  }
}
```

### 2. 取消点赞
```
DELETE /api/posts/{id}/like
Authorization: Bearer <access_token> (可选)
```

### 3. 获取点赞状态
```
GET /api/posts/{id}/like
Authorization: Bearer <access_token> (可选)
```

## 统计相关接口

### 1. 获取年龄统计
```
GET /api/stats/ages
```

**响应：**
```json
{
  "success": true,
  "data": {
    "age_counts": {
      "7": 5,
      "8": 12,
      "18": 371,
      "25": 115
    },
    "total_posts": 2847,
    "total_users": 1234
  }
}
```

### 2. 获取热门内容
```
GET /api/stats/trending?limit={limit}&days={days}
```

**查询参数：**
- `limit` (optional): 返回数量，默认10
- `days` (optional): 时间范围（天），默认7

### 3. 获取用户统计
```
GET /api/stats/user/{user_id}
Authorization: Bearer <access_token>
```

## 用户相关接口

### 1. 获取用户资料
```
GET /api/users/{user_id}
```

### 2. 更新用户资料
```
PUT /api/users/{user_id}
Authorization: Bearer <access_token>
```

**请求体：**
```json
{
  "bio": "string (可选，最大500字符)",
  "avatar_url": "string (可选)"
}
```

### 3. 获取用户发布的内容
```
GET /api/users/{user_id}/posts?page={page}&limit={limit}
```

### 4. 获取用户点赞的内容
```
GET /api/users/{user_id}/likes?page={page}&limit={limit}
Authorization: Bearer <access_token>
```

## 搜索相关接口

### 1. 搜索内容
```
GET /api/search/posts?q={query}&age={age}&page={page}&limit={limit}
```

**查询参数：**
- `q` (required): 搜索关键词
- `age` (optional): 筛选年龄
- `page` (optional): 页码
- `limit` (optional): 每页数量

### 2. 搜索用户
```
GET /api/search/users?q={query}&page={page}&limit={limit}
```

## 管理相关接口

### 1. 举报内容
```
POST /api/reports
Authorization: Bearer <access_token>
```

**请求体：**
```json
{
  "post_id": "uuid",
  "reason": "string",
  "description": "string (可选)"
}
```

### 2. 获取举报列表（管理员）
```
GET /api/admin/reports?status={status}&page={page}&limit={limit}
Authorization: Bearer <admin_token>
```

### 3. 处理举报（管理员）
```
PUT /api/admin/reports/{id}
Authorization: Bearer <admin_token>
```

## 错误码定义

### 认证相关错误
- `AUTH_001` - 用户名已存在
- `AUTH_002` - 邮箱已存在
- `AUTH_003` - 用户名或密码错误
- `AUTH_004` - Token已过期
- `AUTH_005` - Token无效

### 内容相关错误
- `POST_001` - 内容不能为空
- `POST_002` - 内容长度超限
- `POST_003` - 年龄范围无效
- `POST_004` - 内容不存在
- `POST_005` - 无权限操作

### 点赞相关错误
- `LIKE_001` - 已经点过赞
- `LIKE_002` - 未点赞无法取消
- `LIKE_003` - 点赞过于频繁

### 系统相关错误
- `SYS_001` - 请求参数错误
- `SYS_002` - 请求过于频繁
- `SYS_003` - 服务器内部错误
- `SYS_004` - 数据库连接错误

## 限流策略

### 1. 全局限流
- 每个IP每分钟最多100个请求
- 每个用户每分钟最多50个请求

### 2. 特定接口限流
- 发布内容：每个用户每分钟最多5次
- 点赞操作：每个用户每分钟最多20次
- 注册登录：每个IP每分钟最多10次

### 3. 限流响应
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "请求过于频繁，请稍后再试",
    "details": {
      "retry_after": 60
    }
  }
}
```

## 缓存策略

### 1. 内容缓存
- 年龄统计：缓存5分钟
- 热门内容：缓存10分钟
- 内容列表：缓存2分钟

### 2. 用户缓存
- 用户信息：缓存30分钟
- 用户统计：缓存10分钟

### 3. 缓存头设置
```
Cache-Control: public, max-age=300
ETag: "version-hash"
Last-Modified: "timestamp"
```

这个API设计为前端提供了完整的数据接口支持，确保了功能的完整性和扩展性。
