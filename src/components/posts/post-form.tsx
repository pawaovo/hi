'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { SimpleAuthModal } from '@/components/auth/simple-auth-modal'
import { generateAgeRange, CONTENT_LIMITS } from '@/lib/constants'
import { ApiClient } from '@/lib/api-client'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { ToastContainer } from '@/components/ui/toast'

interface PostFormProps {
  targetAge: number
  onPostCreated?: () => void
}

export function PostForm({ targetAge, onPostCreated }: PostFormProps) {
  const { user, isAuthenticated } = useAuth()
  const { toasts, removeToast, success, error } = useToast()
  const [content, setContent] = useState('')
  const [authorAge, setAuthorAge] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const ageOptions = generateAgeRange()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 验证内容
    if (!content.trim()) {
      error('请输入您想分享的内容')
      return
    }

    if (content.length > CONTENT_LIMITS.MAX_LENGTH) {
      error(`内容不能超过${CONTENT_LIMITS.MAX_LENGTH}个字符`)
      return
    }

    // 验证年龄
    if (!authorAge) {
      error('请选择您的当前年龄')
      return
    }

    setIsSubmitting(true)

    try {
      // 直接使用 ApiClient 而不是 API 路由
      const result = await ApiClient.createPost({
        target_age: targetAge,
        content: content.trim(),
        author_age: parseInt(authorAge),
        user_id: user?.id || undefined,
        username: user?.username || undefined
      })

      if (result.success) {
        success('发出回响')
        setContent('')
        setAuthorAge('')
        onPostCreated?.()
      } else {
        error('发布失败', result.error || '请检查网络连接后重试')
      }
    } catch (err) {
      console.error('Error creating post:', err)
      error('网络错误', '请检查网络连接后重试')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAuthRequired = () => {
    setShowAuthModal(true)
  }

  return (
    <>
      <Card className="mb-6 bg-gradient-to-br from-amber-50/30 to-orange-50/20 border-amber-100/50 shadow-sm">
        <CardHeader>
          <CardDescription>
            {isAuthenticated
              ? `以 ${user?.username} 的身份发布，内容将关联到您的账户`
              : '匿名发布，或者登录后发布（内容将关联到您的账户）'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Select value={authorAge} onValueChange={setAuthorAge}>
                <SelectTrigger>
                  <SelectValue placeholder="选择您的年龄" />
                </SelectTrigger>
                <SelectContent className="max-h-[320px]">
                  {ageOptions.map((age) => (
                    <SelectItem key={age} value={age.toString()}>
                      {age}岁
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Textarea
                id="content"
                placeholder={`嗨 ${targetAge}岁，`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
                maxLength={CONTENT_LIMITS.MAX_LENGTH}
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-muted-foreground">
                  对{targetAge}岁的自己或他人说点什么？
                </p>
                <p className="text-xs text-muted-foreground">
                  {content.length}/{CONTENT_LIMITS.MAX_LENGTH}
                </p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                type="submit" 
                disabled={isSubmitting || !content.trim() || !authorAge}
                className="flex-1"
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isAuthenticated ? '发布' : '匿名发布'}
              </Button>
              
              {!isAuthenticated && (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleAuthRequired}
                  className="flex-1"
                >
                  登录后发布
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <SimpleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
