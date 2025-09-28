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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-slate-800">
            网站统计
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <StatsCards
            statItems={statItems}
            loading={loading}
            error={error}
            gridCols="grid-cols-2"
            showError={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
