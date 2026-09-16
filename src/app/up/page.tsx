import type { Metadata } from 'next'
import { UpPageClient } from '@/components/up/up-page-client'

export const metadata: Metadata = {
  title: '人生七年 The Up Series · 14 个人，62 年',
  description:
    '英国纪录片《人生七年》(The Up Series) 科普专题：14 位参与者从 7 岁到 70 岁的完整轨迹、时间轴矩阵与主题观察。',
  keywords: '人生七年,The Up Series,纪录片,Michael Apted,70 Up,时间轴',
}

export default function UpPage() {
  return <UpPageClient />
}
