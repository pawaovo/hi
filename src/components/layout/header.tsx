'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { StatsModal } from '@/components/common/stats-modal'

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [statsModalOpen, setStatsModalOpen] = useState(false)

  // 提取重复的样式
  const buttonStyles = "transition-all duration-200 ease-out hover:shadow-md border-slate-300 text-slate-700 hover:bg-slate-50"
  const brandStyles = "text-xl font-bold text-slate-800 group-hover:text-slate-600 transition-colors"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center">
        {/* 左侧占位区域 */}
        <div className="flex-1"></div>

        {/* 居中的品牌区域 */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className={brandStyles}>
              Hi echo
            </span>
          </Link>
        </div>

        {/* 右侧导航区域 */}
        <div className="flex-1 flex justify-end pr-4">
          <nav className="flex items-center space-x-3">
            {/* 统计按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStatsModalOpen(true)}
              className={buttonStyles}
            >
              统计
            </Button>

            {isLoading ? (
              <div className="h-9 w-12 animate-pulse rounded-lg bg-slate-200" />
            ) : isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className={buttonStyles}
                >
                  <Link href="/profile">账户</Link>
                </Button>
                <span className="text-sm text-slate-600 font-medium">
                  {user.username}
                </span>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                asChild
                className="transition-all duration-200 ease-out hover:shadow-md bg-slate-800 hover:bg-slate-700 text-white"
              >
                <Link href="/login">登录</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>

      {/* 统计信息弹窗 */}
      <StatsModal
        open={statsModalOpen}
        onOpenChange={setStatsModalOpen}
      />
    </header>
  )
}
