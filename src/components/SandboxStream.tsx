import type { MemoEntry } from '../types/entry'
import { groupByDay } from '../lib/groupByDay'
import { StreamCard } from './StreamCard'

interface SandboxStreamProps {
  entries: MemoEntry[]
  dimmed: boolean
  hasFilters: boolean
  onToggleComplete: (id: string) => void
  onUpdate: (id: string, content: string) => void
  onDeleteRequest: (id: string) => void
}

export function SandboxStream({
  entries,
  dimmed,
  hasFilters,
  onToggleComplete,
  onUpdate,
  onDeleteRequest,
}: SandboxStreamProps) {
  const groups = groupByDay(entries)

  const emptyMessage = hasFilters
    ? '没有匹配的条目，试试其他关键词或标签'
    : '还没有记录，开始写下第一个 Little Win 吧'

  return (
    <div
      className={`flex-1 overflow-y-auto px-4 py-6 transition-opacity duration-200 sm:px-6 ${
        dimmed ? 'pointer-events-none opacity-20' : 'opacity-100'
      }`}
    >
      {entries.length === 0 ? (
        <div className="flex h-full min-h-[200px] items-center justify-center">
          <p className="text-sm text-stone-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          {groups.map((group) => (
            <section key={group.label}>
              <h2 className="mb-3 text-xs font-semibold tracking-wider text-stone-400 uppercase">
                {group.label}
                <span className="ml-2 font-normal normal-case">
                  · {group.entries.length} 条
                </span>
              </h2>
              <div className="flex flex-col gap-3">
                {group.entries.map((entry) => (
                  <StreamCard
                    key={entry.id}
                    entry={entry}
                    onToggleComplete={onToggleComplete}
                    onUpdate={onUpdate}
                    onDeleteRequest={onDeleteRequest}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
