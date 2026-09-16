import { cn } from '@/lib/utils'
import { UP_MARK_DOT } from './up-mark'
import type { MarkKind } from '@/lib/up-series'

/** 转折点圆点：大圆＝人生拐点，小圆＝常规节点 */
export function UpDot({
  kind,
  size = 'sm',
}: {
  kind?: MarkKind
  size?: 'sm' | 'md'
}) {
  const dim = kind ? (size === 'md' ? 'h-2.5 w-2.5' : 'h-2 w-2') : 'h-1.5 w-1.5'
  const color = kind ? UP_MARK_DOT[kind] : 'bg-slate-300'
  return <span className={cn('inline-block shrink-0 rounded-full', dim, color)} />
}
