'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')

  const { signIn, signUp, isLoading } = useAuthStore()

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = '请输入邮箱'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址'
    }

    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = '请输入密码'
      } else if (formData.password.length < 6) {
        newErrors.password = '密码至少需要6位'
      }

      if (mode === 'signup') {
        if (!formData.username) {
          newErrors.username = '请输入用户名'
        } else if (formData.username.length < 3) {
          newErrors.username = '用户名至少需要3位'
        }

        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = '两次输入的密码不一致'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    if (!validateForm()) return

    try {
      if (mode === 'signin') {
        const { error } = await signIn({
          username: formData.email, // 使用 email 作为 username
          password: formData.password
        })

        if (error) {
          setMessage(error.message || '登录失败')
        } else {
          setMessage('登录成功！')
          setTimeout(() => onClose(), 1000)
        }
      } else if (mode === 'signup') {
        const { error } = await signUp({
          username: formData.username,
          password: formData.password
        })

        if (error) {
          setMessage(error.message || '注册失败')
        } else {
          setMessage('注册成功！请检查邮箱验证邮件。')
          setTimeout(() => {
            setMode('signin')
            setMessage('')
          }, 2000)
        }
      } else if (mode === 'reset') {
        // 重置密码功能暂未实现
        setMessage('重置密码功能暂未实现，请联系管理员')
        setTimeout(() => {
          setMode('signin')
          setMessage('')
        }, 2000)
      }
    } catch {
      setMessage('操作失败，请重试')
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
      confirmPassword: ''
    })
    setErrors({})
    setMessage('')
  }

  const switchMode = (newMode: 'signin' | 'signup' | 'reset') => {
    setMode(newMode)
    resetForm()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle>
            {mode === 'signin' && '登录'}
            {mode === 'signup' && '注册'}
            {mode === 'reset' && '重置密码'}
          </CardTitle>
          <CardDescription>
            {mode === 'signin' && '欢迎回来！请登录您的账户'}
            {mode === 'signup' && '创建新账户开始分享智慧'}
            {mode === 'reset' && '输入邮箱地址重置密码'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="邮箱地址"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {mode === 'signup' && (
              <div>
                <Input
                  type="text"
                  placeholder="用户名"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className={errors.username ? 'border-red-500' : ''}
                />
                {errors.username && <p className="text-sm text-red-500 mt-1">{errors.username}</p>}
              </div>
            )}

            {mode !== 'reset' && (
              <>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="密码"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={errors.password ? 'border-red-500' : ''}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}

                {mode === 'signup' && (
                  <div>
                    <Input
                      type="password"
                      placeholder="确认密码"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>}
                  </div>
                )}
              </>
            )}

            {message && (
              <p className={`text-sm ${message.includes('成功') || message.includes('已发送') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'signin' && '登录'}
              {mode === 'signup' && '注册'}
              {mode === 'reset' && '发送重置邮件'}
            </Button>
          </form>

          <div className="mt-4 text-center space-y-2">
            {mode === 'signin' && (
              <>
                <Button variant="link" onClick={() => switchMode('reset')} className="text-sm">
                  忘记密码？
                </Button>
                <div>
                  <span className="text-sm text-muted-foreground">还没有账户？</span>
                  <Button variant="link" onClick={() => switchMode('signup')} className="text-sm p-0 ml-1">
                    立即注册
                  </Button>
                </div>
              </>
            )}

            {mode === 'signup' && (
              <div>
                <span className="text-sm text-muted-foreground">已有账户？</span>
                <Button variant="link" onClick={() => switchMode('signin')} className="text-sm p-0 ml-1">
                  立即登录
                </Button>
              </div>
            )}

            {mode === 'reset' && (
              <Button variant="link" onClick={() => switchMode('signin')} className="text-sm">
                返回登录
              </Button>
            )}

            <Button variant="outline" onClick={onClose} className="w-full mt-4">
              取消
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
