import { notFound } from 'next/navigation'
import { AgePageClient } from '@/components/age/age-page-client'
import { isValidAge, generateAgeRange } from '@/lib/constants'

// 生成静态参数用于静态导出
export function generateStaticParams() {
  const ages = generateAgeRange()
  return ages.map((age) => ({
    age: age.toString(),
  }))
}

interface AgePageProps {
  params: Promise<{
    age: string
  }>
}

export default async function AgePage({ params }: AgePageProps) {
  const { age: ageParam } = await params
  const age = parseInt(ageParam)

  // 验证年龄范围
  if (isNaN(age) || !isValidAge(age)) {
    notFound()
  }

  return <AgePageClient age={age} />
}