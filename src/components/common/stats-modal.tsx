'use client'

import { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSiteStats } from '@/hooks/use-site-stats'
import { StatsCards } from '@/components/common/stats-cards'

interface StatsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StatsModal({ open, onOpenChange }: StatsModalProps) {
  const { stats, loading, error, fetchStats, statItems } = useSiteStats(false)

  useEffect(() => {
    if (open && !stats) {
      fetchStats()
    }
  }, [open, stats, fetchStats])

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">
            网站统计
          </DialogTitle>
        </DialogHeader>

        <div className="py-6 space-y-6">
          <StatsCards
            statItems={statItems}
            loading={loading}
            error={error}
            gridCols="grid-cols-3"
            showError={true}
          />

          {/* 活跃用户年龄段 */}
          {stats && stats.active_user_groups.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                活跃用户
              </h3>
              <div className="flex justify-center space-x-8">
                {stats.active_user_groups.map((group) => (
                  <div key={group.ageRange} className="text-center">
                    <div className="text-sm text-slate-600 mb-1">
                      {group.ageRange}
                    </div>
                    <div className="text-xl font-bold text-slate-800">
                      {group.userCount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
