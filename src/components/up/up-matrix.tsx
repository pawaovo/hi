'use client'

import { useMemo } from 'react'
import { cn } from '@/lib/utils'
import {
  UP_AGES,
  UP_GROUPS,
  UP_PEOPLE,
  MARK_LABEL,
  type UpPerson,
} from '@/lib/up-series'
import { UP_MARK_DOT } from './up-mark'

/** 预建查找索引：personId → (age → mark/stage)，避免渲染时反复线性查找 */
type PersonIndex = {
  markByAge: Map<number, UpPerson['marks'][number]>
  stageByAge: Map<number, UpPerson['stages'][number]>
}

const PERSON_INDEX: Map<string, PersonIndex> = new Map(
  UP_PEOPLE.map((p) => [
    p.id,
    {
      markByAge: new Map(p.marks.map((m) => [m.age, m])),
      stageByAge: new Map(p.stages.map((s) => [s.age, s])),
    },
  ])
)

function markOf(personId: string, age: number) {
  return PERSON_INDEX.get(personId)?.markByAge.get(age)
}

function stageOf(personId: string, age: number) {
  return PERSON_INDEX.get(personId)?.stageByAge.get(age)
}

/** 桌面端：完整矩阵 */
function MatrixView({ onPick }: { onPick: (id: string) => void }) {
  // 扁平化：组头行 + 该组成员行，统一为一维数组，避免 Fragment 无 key 的问题
  const rows = useMemo(
    () =>
      UP_GROUPS.flatMap((group) => {
        const members = UP_PEOPLE.filter((p) => p.group === group.id)
        if (!members.length) return []
        return [
          { kind: 'group' as const, key: `g-${group.id}`, group, person: null },
          ...members.map((person) => ({
            kind: 'person' as const,
            key: person.id,
            group,
            person,
          })),
        ]
      }),
    []
  )

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full border-separate border-spacing-0 text-left">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm py-3 pr-4 text-sm font-normal text-slate-400 border-b border-slate-200">
              人物
            </th>
            {UP_AGES.map((age) => (
              <th
                key={age}
                className="py-3 px-1 text-center text-sm font-medium text-slate-400 border-b border-slate-200"
              >
                <span className="block text-sm text-slate-600 tabular-nums">{age}</span>
                <span className="block text-sm font-normal text-slate-300">岁</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) =>
            row.kind === 'group' ? (
              <tr key={row.key}>
                <td
                  colSpan={UP_AGES.length + 1}
                  className="pt-7 pb-2 text-sm text-slate-400"
                >
                  {row.group.label}
                  <span className="ml-2 text-slate-300">{row.group.desc}</span>
                </td>
              </tr>
            ) : (
              <tr key={row.key} className="group">
                <td className="sticky left-0 z-10 bg-white/95 backdrop-blur-sm py-3 pr-4 border-b border-slate-100 align-middle">
                  <button
                    type="button"
                    onClick={() => onPick(row.person.id)}
                    className="text-left leading-tight"
                  >
                    <span className="block text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                      {row.person.name}
                    </span>
                    {row.person.deceased && (
                      <span className="block text-sm text-slate-400">
                        {row.person.deceased}
                      </span>
                    )}
                  </button>
                </td>
                {UP_AGES.map((age) => {
                  const mark = markOf(row.person.id, age)
                  const stage = stageOf(row.person.id, age)
                  const muted = !stage || stage.stage === '——'
                  return (
                    <td
                      key={age}
                      className="py-3 px-1 border-b border-slate-100 text-center align-middle"
                    >
                      <button
                        type="button"
                        onClick={() => onPick(row.person.id)}
                        className="mx-auto flex flex-col items-center gap-1.5"
                        title={stage?.detail}
                      >
                        <span
                          className={cn(
                            'text-sm leading-tight',
                            muted ? 'text-slate-300' : 'text-slate-600'
                          )}
                        >
                          {stage?.stage ?? '——'}
                        </span>
                        <span
                          className={cn(
                            'h-2 w-2 rounded-full',
                            mark ? UP_MARK_DOT[mark.kind] : 'bg-slate-300'
                          )}
                        />
                      </button>
                    </td>
                  )
                })}
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  )
}

/** 移动端：逐人卡片 */
function CardView({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="md:hidden space-y-5">
      {UP_GROUPS.map((group) => {
        const members = UP_PEOPLE.filter((p) => p.group === group.id)
        if (!members.length) return null
        return (
          <div key={group.id} className="space-y-4">
            <p className="text-sm text-slate-400 pt-2">{group.label}</p>
            {members.map((person) => (
              <div
                key={person.id}
                className="rounded-lg border border-slate-200 bg-white p-5"
              >
                <button
                  type="button"
                  onClick={() => onPick(person.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-base font-medium text-slate-600">
                      {person.name}
                    </span>
                    {person.deceased && (
                      <span className="text-sm text-slate-400">
                        {person.deceased}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-sm text-slate-400">{person.origin}</p>
                  <div className="mt-4 space-y-2.5">
                    {person.stages
                      .filter((s) => s.stage !== '——')
                      .map((s) => {
                        const mark = markOf(person.id, s.age)
                        return (
                          <div key={s.age} className="flex items-center gap-3">
                            <span className="w-9 shrink-0 text-right text-sm text-slate-400 tabular-nums">
                              {s.age}
                            </span>
                            <span
                              className={cn(
                                'h-2 w-2 shrink-0 rounded-full',
                                mark ? UP_MARK_DOT[mark.kind] : 'bg-slate-300'
                              )}
                            />
                            <span className="text-sm text-slate-600">{s.stage}</span>
                          </div>
                        )
                      })}
                    {person.stages.some((s) => s.stage === '——') && (
                      <div className="flex items-center gap-3">
                        <span className="w-9 shrink-0 text-right text-sm text-slate-300">
                          ···
                        </span>
                        <span className="h-2 w-2 shrink-0 rounded-full bg-slate-200" />
                        <span className="text-sm text-slate-400">
                          此后未再参与拍摄
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export function UpMatrix({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div>
      <MatrixView onPick={onPick} />
      <CardView onPick={onPick} />
      {/* 图例 */}
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-400">
        {(Object.keys(MARK_LABEL) as Array<keyof typeof MARK_LABEL>).map((k) => (
          <span key={k} className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', UP_MARK_DOT[k])} />
            {MARK_LABEL[k]}
          </span>
        ))}
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-slate-300" />
          无标记
        </span>
        <span className="text-slate-400">
          标记依据当事人在片中明确表达过的感受
        </span>
      </div>
    </div>
  )
}
