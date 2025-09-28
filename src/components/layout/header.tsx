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
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2 group">
            <span className={brandStyles}>
              年龄智慧
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="flex items-center space-x-2 md:hidden group">
              <span className={brandStyles}>
                年龄智慧
              </span>
            </Link>
          </div>

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
