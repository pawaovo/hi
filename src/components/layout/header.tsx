'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { StatsModal } from '@/components/common/stats-modal'
import { ProfileModal } from '@/components/common/profile-modal'

export function Header() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const [statsModalOpen, setStatsModalOpen] = useState(false)
  const [profileModalOpen, setProfileModalOpen] = useState(false)

  // 提取重复的样式
  const buttonStyles = "transition-all duration-200 ease-out hover:shadow-md border-slate-300 text-slate-700 hover:bg-slate-50"
  const brandStyles = "text-4xl font-extrabold tracking-wide text-black group-hover:text-slate-800 transition-all duration-300 drop-shadow-md [text-shadow:_0_2px_8px_rgb(0_0_0_/_0.15)]"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 relative flex items-center">
        {/* 居中的品牌区域 - 绝对居中 */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className={brandStyles}>
              Hi echo
            </span>
          </Link>
        </div>

        {/* 右侧导航区域 - 绝对定位 */}
        <div className="ml-auto">
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
                  onClick={() => setProfileModalOpen(true)}
                  className={buttonStyles}
                >
                  账户
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

      {/* 账户信息弹窗 */}
      <ProfileModal
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />
    </header>
  )
}
