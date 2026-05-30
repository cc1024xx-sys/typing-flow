import type { MemoEntry } from '../types/entry'

export interface DayGroup {
  label: string
  entries: MemoEntry[]
}

function formatDayLabel(ts: number): string {
  const d = new Date(ts)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(d)
  target.setHours(0, 0, 0, 0)
  const diff = today.getTime() - target.getTime()

  if (diff === 0) return '今天'
  if (diff === 86400000) return '昨天'
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export function groupByDay(entries: MemoEntry[]): DayGroup[] {
  const sorted = [...entries].sort((a, b) => b.createdAt - a.createdAt)
  const map = new Map<string, MemoEntry[]>()

  for (const entry of sorted) {
    const label = formatDayLabel(entry.createdAt)
    const group = map.get(label)
    if (group) {
      group.push(entry)
    } else {
      map.set(label, [entry])
    }
  }

  return [...map.entries()].map(([label, groupEntries]) => ({
    label,
    entries: groupEntries,
  }))
}

export function getUniqueTags(entries: MemoEntry[]): string[] {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    for (const tag of entry.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name)
}
