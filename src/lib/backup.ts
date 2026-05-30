import type { Category, MemoEntry } from '../types/entry'

const VALID_CATEGORIES: Category[] = ['todo', 'idea', 'review', 'note', 'daily']

export interface BackupFile {
  version: number
  exportedAt: number
  entries: MemoEntry[]
}

export interface MergeResult {
  merged: MemoEntry[]
  added: number
  skipped: number
}

function isValidEntry(obj: unknown): obj is MemoEntry {
  if (!obj || typeof obj !== 'object') return false
  const e = obj as Record<string, unknown>
  return (
    typeof e.id === 'string' &&
    typeof e.content === 'string' &&
    typeof e.category === 'string' &&
    VALID_CATEGORIES.includes(e.category as Category) &&
    Array.isArray(e.tags) &&
    e.tags.every((t) => typeof t === 'string') &&
    typeof e.isCompleted === 'boolean' &&
    typeof e.createdAt === 'number'
  )
}

export function parseBackupFile(raw: unknown): MemoEntry[] {
  if (Array.isArray(raw)) {
    return raw.filter(isValidEntry)
  }
  if (raw && typeof raw === 'object' && 'entries' in raw) {
    const entries = (raw as BackupFile).entries
    return Array.isArray(entries) ? entries.filter(isValidEntry) : []
  }
  return []
}

export function mergeEntries(existing: MemoEntry[], imported: MemoEntry[]): MergeResult {
  const existingIds = new Set(existing.map((e) => e.id))
  const toAdd = imported.filter((e) => !existingIds.has(e.id))
  const merged = [...existing, ...toAdd].sort((a, b) => b.createdAt - a.createdAt)
  return {
    merged,
    added: toAdd.length,
    skipped: imported.length - toAdd.length,
  }
}

export function createBackupFile(entries: MemoEntry[]): BackupFile {
  return {
    version: 1,
    exportedAt: Date.now(),
    entries,
  }
}

export function downloadBackup(entries: MemoEntry[]): void {
  const backup = createBackupFile(entries)
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const date = new Date().toISOString().slice(0, 10)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `typing-flow-backup-${date}.json`
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function readBackupFile(file: File): Promise<MemoEntry[]> {
  const text = await file.text()
  const parsed = JSON.parse(text) as unknown
  return parseBackupFile(parsed)
}
