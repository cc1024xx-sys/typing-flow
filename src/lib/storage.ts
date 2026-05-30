import type { MemoEntry } from '../types/entry'

const STORAGE_KEY = 'typing-flow:entries'

export function loadEntries(): MemoEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as MemoEntry[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveEntries(entries: MemoEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}
