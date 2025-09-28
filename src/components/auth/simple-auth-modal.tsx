'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'react-hot-toast'

interface SimpleAuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SimpleAuthModal({ isOpen, onClose }: SimpleAuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signIn, signUp } = useAuth()

  if (!isOpen) return null

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setIsLogin(true)
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 表单验证
    if (!username.trim()) {
      toast.error('请输入用户名')
      return
    }

    if (!password.trim()) {
      toast.error('请输入密码')
      return
    }

    setIsLoading(true)

    try {
      if (isLogin) {
        // 登录
        const { error } = await signIn({ username, password })
        if (error) {
          toast.error(error.message || '登录失败')
        } else {
          toast.success('登录成功！')
          resetForm()
          onClose()
        }
      } else {
        // 注册
        const { error } = await signUp({ username, password })
        if (error) {
          toast.error(error.message || '注册失败')
        } else {
          toast.success('注册成功！')
          resetForm()
          onClose()
        }
      }
    } catch {
      toast.error('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-white">
            {isLogin ? '登录' : '注册'}
          </CardTitle>
          <CardDescription>
            {isLogin ? '欢迎回到年龄智慧' : '加入年龄智慧社区'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? '处理中...' : (isLogin ? '登录' : '注册')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-slate-800 dark:text-white hover:underline font-medium"
              >
                {isLogin ? '立即注册' : '立即登录'}
              </button>
            </p>
          </div>
          
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="w-full"
            >
              取消
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
