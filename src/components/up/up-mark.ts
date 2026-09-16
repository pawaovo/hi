import type { MarkKind } from '@/lib/up-series'

/** 转折点圆点配色 */
export const UP_MARK_DOT: Record<MarkKind, string> = {
  rise: 'bg-emerald-500',
  fall: 'bg-rose-500',
  turn: 'bg-amber-500',
}

/** 转折点在矩阵中的文字色 */
export const UP_MARK_TEXT: Record<MarkKind, string> = {
  rise: 'text-emerald-700',
  fall: 'text-rose-700',
  turn: 'text-amber-700',
}
