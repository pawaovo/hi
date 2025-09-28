import { NextResponse } from 'next/server'

// API错误类型
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

// 统一的错误响应格式
export function createErrorResponse(
  error: string | Error | APIError,
  statusCode: number = 500,
  code?: string
) {
  let message: string
  let finalStatusCode: number
  let errorCode: string | undefined

  if (error instanceof APIError) {
    message = error.message
    finalStatusCode = error.statusCode
    errorCode = error.code
  } else if (error instanceof Error) {
    message = error.message
    finalStatusCode = statusCode
    errorCode = code
  } else {
    message = error
    finalStatusCode = statusCode
    errorCode = code
  }

  return NextResponse.json(
    {
      error: message,
      code: errorCode,
      timestamp: new Date().toISOString()
    },
    { status: finalStatusCode }
  )
}

// 统一的成功响应格式
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
) {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: new Date().toISOString()
    },
    { status: statusCode }
  )
}

// API路由包装器，统一错误处理
export function withErrorHandling<T extends unknown[]>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof APIError) {
        return createErrorResponse(error)
      }
      
      // 数据库错误
      if (error && typeof error === 'object' && 'code' in error) {
        const dbError = error as { code: string; message?: string }
        switch (dbError.code) {
          case '23505': // 唯一约束违反
            return createErrorResponse('数据已存在', 409, 'DUPLICATE_ENTRY')
          case '23503': // 外键约束违反
            return createErrorResponse('关联数据不存在', 400, 'FOREIGN_KEY_VIOLATION')
          case '42501': // 权限不足
            return createErrorResponse('权限不足', 403, 'INSUFFICIENT_PERMISSIONS')
          default:
            return createErrorResponse('数据库操作失败', 500, 'DATABASE_ERROR')
        }
      }
      
      // 默认错误
      return createErrorResponse('服务器内部错误', 500, 'INTERNAL_ERROR')
    }
  }
}

// 验证请求参数
export function validateRequired(params: Record<string, unknown>, required: string[]) {
  const missing = required.filter(key => !params[key])
  if (missing.length > 0) {
    throw new APIError(
      `缺少必需参数: ${missing.join(', ')}`,
      400,
      'MISSING_PARAMETERS'
    )
  }
}

// 验证分页参数
export function validatePagination(page?: string, limit?: string) {
  const pageNum = parseInt(page || '1')
  const limitNum = parseInt(limit || '20')
  
  if (isNaN(pageNum) || pageNum < 1) {
    throw new APIError('页码必须是大于0的整数', 400, 'INVALID_PAGE')
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    throw new APIError('每页数量必须是1-100之间的整数', 400, 'INVALID_LIMIT')
  }
  
  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum
  }
}

// 验证年龄参数
export function validateAge(age: string | number) {
  const ageNum = typeof age === 'string' ? parseInt(age) : age
  
  if (isNaN(ageNum) || ageNum < 7 || ageNum > 91) {
    throw new APIError('年龄必须在7-91岁之间', 400, 'INVALID_AGE')
  }
  
  return ageNum
}

// 速率限制检查（简单实现）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1分钟
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= maxRequests) {
    return false
  }
  
  record.count++
  return true
}
