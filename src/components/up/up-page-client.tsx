'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  UP_EPISODES,
  UP_GROUPS,
  UP_PEOPLE,
  UP_THEMES,
  UP_CRITIQUES,
  UP_INTRO,
  UP_NAV,
  type UpPerson,
} from '@/lib/up-series'
import { UpMatrix } from '@/components/up/up-matrix'
import { UP_MARK_DOT } from '@/components/up/up-mark'

/** personId → (age → mark)，避免渲染时线性查找 */
const MARK_INDEX = new Map(
  UP_PEOPLE.map((p) => [p.id, new Map(p.marks.map((m) => [m.age, m]))])
)

/** groupId → 分组标签 */
const GROUP_LABEL = new Map(UP_GROUPS.map((g) => [g.id, g.label]))

function markOf(personId: string, age: number) {
  return MARK_INDEX.get(personId)?.get(age)
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-28 py-16 border-t border-slate-200/70">
      <h2 className="text-xl md:text-2xl font-semibold text-slate-600 mb-8 tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  )
}

function PersonCard({ person }: { person: UpPerson }) {
  const groupLabel = GROUP_LABEL.get(person.group) ?? ''
  const hasGap = person.stages.some((s) => s.stage === '——')
  return (
    <article
      id={`person-${person.id}`}
      className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-5 md:p-6"
    >
      <header className="mb-5">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-semibold text-slate-600">{person.name}</h3>
          <span className="text-sm text-slate-400">{groupLabel}</span>
          {person.deceased && (
            <span className="text-sm text-slate-400">· {person.deceased}</span>
          )}
        </div>
        <p className="mt-1.5 text-sm text-slate-400">{person.origin}</p>
        <p className="mt-3 text-base text-slate-600 leading-relaxed">
          {person.tagline}
        </p>
      </header>

      <ul className="space-y-3">
        {person.stages
          .filter((s) => s.stage !== '——')
          .map((s) => {
            const mark = markOf(person.id, s.age)
            return (
              <li key={s.age} className="flex gap-3">
                <span className="w-12 shrink-0 pt-0.5 text-right text-sm text-slate-400 tabular-nums">
                  {s.age} 岁
                </span>
                <span className="pt-2">
                  <span
                    className={cn(
                      'block h-2 w-2 rounded-full',
                      mark ? UP_MARK_DOT[mark.kind] : 'bg-slate-300'
                    )}
                  />
                </span>
                <span className="flex-1 text-sm leading-relaxed text-slate-600">
                  {s.detail}
                </span>
              </li>
            )
          })}
        {hasGap && (
          <li className="flex gap-3">
            <span className="w-12 shrink-0 pt-0.5 text-right text-sm text-slate-300">
              ···
            </span>
            <span className="pt-2">
              <span className="block h-2 w-2 rounded-full bg-slate-200" />
            </span>
            <span className="flex-1 text-sm leading-relaxed text-slate-400">
              此后未再参与拍摄
            </span>
          </li>
        )}
      </ul>
    </article>
  )
}

export function UpPageClient() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  const scrollToPerson = (id: string) => {
    const el = document.getElementById(`person-${id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const shownPeople = activeGroup
    ? UP_PEOPLE.filter((p) => p.group === activeGroup)
    : UP_PEOPLE

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50">
      <div className="container mx-auto px-4 pb-24 max-w-5xl">
        {/* ---------- 头图 ---------- */}
        <header className="pt-6 pb-14 text-center">
          <p className="text-sm tracking-[0.2em] text-slate-400 uppercase">
            The Up Series · 1964 — 2026
          </p>
          <h1 className="mt-6 text-4xl font-bold text-slate-600 tracking-tight">
            人生七年
          </h1>
          <p className="mt-6 text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            {UP_INTRO.lead}
            <br />
            此后每七年回访一次，一直拍到他们 70 岁。
          </p>
          <div className="mt-8 w-72 h-1 bg-gradient-to-r from-slate-300 to-slate-400 mx-auto rounded-full" />
          <p className="mt-6 text-base text-slate-500">
            B站id：小威哥z，人生七年10持续更新中，目前S10E1
          </p>
        </header>

        {/* ---------- 锚点导航 ---------- */}
        <nav className="sticky top-16 z-30 -mx-4 px-4 py-4 bg-white/90 backdrop-blur-md border-y border-slate-200/70 mb-2">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center">
            {UP_NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/"
                className="text-sm text-slate-400 hover:text-slate-700 transition-colors"
              >
                ← 返回
              </Link>
            </li>
          </ul>
        </nav>

        {/* ---------- 一 · 系列简介 ---------- */}
        <Section id="intro" title="系列简介">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-5">
              {UP_INTRO.body.map((p) => (
                <p key={p} className="text-base text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <p className="text-base font-semibold text-slate-600 mb-5">十部作品</p>
              <ul className="space-y-3">
                {UP_EPISODES.map((ep) => (
                  <li key={ep.age} className="flex items-baseline gap-3">
                    <span className="w-10 shrink-0 text-sm text-slate-400 tabular-nums">
                      {ep.year}
                    </span>
                    <span className="w-12 shrink-0 text-sm text-slate-500 tabular-nums">
                      {ep.age} 岁
                    </span>
                    <span className="flex-1 text-sm text-slate-600">{ep.title}</span>
                    {ep.note && (
                      <span className="text-sm text-slate-400">{ep.note}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="mt-6 pt-5 border-t border-slate-100 text-sm leading-relaxed text-slate-400">
                {UP_INTRO.crew}
              </p>
            </div>
          </div>
        </Section>

        {/* ---------- 二 · 时间轴矩阵 ---------- */}
        <Section id="matrix" title="时间轴矩阵">
          <p className="mb-8 text-sm text-slate-400">
            横向是年龄，纵向是 14 位参与者。点任意格可跳到下方的人物志。
          </p>
          <UpMatrix onPick={scrollToPerson} />
        </Section>

        {/* ---------- 三 · 人物索引 ---------- */}
        <Section id="people" title="人物索引">
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveGroup(null)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                activeGroup === null
                  ? 'border-slate-700 bg-slate-800 text-white'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              )}
            >
              全部 14 人
            </button>
            {UP_GROUPS.map((g) => {
              const count = UP_PEOPLE.filter((p) => p.group === g.id).length
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setActiveGroup(g.id)}
                  className={cn(
                    'rounded-full border px-4 py-1.5 text-sm transition-colors',
                    activeGroup === g.id
                      ? 'border-slate-700 bg-slate-800 text-white'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                  )}
                >
                  {g.label}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              )
            })}
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {shownPeople.map((p) => (
              <PersonCard key={p.id} person={p} />
            ))}
          </div>
        </Section>

        {/* ---------- 四 · 主题观察 ---------- */}
        <Section id="themes" title="主题观察">
          <div className="grid gap-5 md:grid-cols-2">
            {UP_THEMES.map((t) => (
              <div
                key={t.title}
                className="rounded-lg border border-slate-200 bg-white p-6"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-semibold text-slate-600">{t.title}</h3>
                  <span className="text-sm text-slate-400">{t.people}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ---------- 五 · 争议与反思 ---------- */}
        <Section id="critique" title="争议与反思">
          <p className="mb-8 text-sm text-slate-400 leading-relaxed">
            这部片子被讨论了很多年，赞誉之外也有持续的批评。以下是被提及最多的几点。
          </p>
          <ol className="space-y-6">
            {UP_CRITIQUES.map((c, i) => (
              <li key={c.title} className="flex gap-5">
                <span className="w-8 shrink-0 pt-0.5 text-sm text-slate-300 tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <p className="text-base font-medium text-slate-600">{c.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {c.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* ---------- 页脚 ---------- */}
        <footer className="pt-12 border-t border-slate-200/70">
          <p className="text-sm text-slate-400 leading-relaxed">
            本页内容根据公开资料整理，仅作科普参考。人物经历以纪录片实际呈现为准；
            70 Up 于 2026 年 9 月 15 日首播，部分细节仍在陆续公开。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <Link
              href="/"
              className="text-slate-500 hover:text-slate-800 transition-colors"
            >
              ← 回到 Hi echo
            </Link>
            <a
              href="#intro"
              className="text-slate-400 hover:text-slate-700 transition-colors"
            >
              回到顶部
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
