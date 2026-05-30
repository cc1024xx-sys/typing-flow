import type { Category, MemoEntry } from '../types/entry'

const CATEGORY_RULES: { pattern: RegExp; category: Category }[] = [
  { pattern: /#待办/, category: 'todo' },
  { pattern: /#灵感/, category: 'idea' },
  { pattern: /#复盘/, category: 'review' },
  { pattern: /#笔记/, category: 'note' },
]

export function parseTags(content: string): string[] {
  return [...new Set((content.match(/#(\S+)/g) ?? []).map((t) => t.slice(1)))]
}

export function parseCategory(content: string): Category {
  return CATEGORY_RULES.find((r) => r.pattern.test(content))?.category ?? 'daily'
}

export function createEntry(content: string): MemoEntry {
  const trimmed = content.trim()
  return {
    id: crypto.randomUUID(),
    content: trimmed,
    category: parseCategory(trimmed),
    tags: parseTags(trimmed),
    isCompleted: false,
    createdAt: Date.now(),
  }
}

export function updateEntryContent(entry: MemoEntry, content: string): MemoEntry {
  const trimmed = content.trim()
  return {
    ...entry,
    content: trimmed,
    category: parseCategory(trimmed),
    tags: parseTags(trimmed),
  }
}
