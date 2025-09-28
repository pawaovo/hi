'use client'

import { useSiteStats } from '@/hooks/use-site-stats'
import { StatsCards } from '@/components/common/stats-cards'

export function SiteStats() {
  const { statItems, loading, error } = useSiteStats(true)

  return (
    <StatsCards
      statItems={statItems}
      loading={loading}
      error={error}
      gridCols="grid-cols-2 md:grid-cols-4"
      showError={false}
    />
  )
}
