import { useRef } from 'react'
import { downloadBackup, mergeEntries, readBackupFile } from '../lib/backup'
import type { MemoEntry } from '../types/entry'

interface BackupControlsProps {
  entries: MemoEntry[]
  onMerge: (merged: MemoEntry[]) => void
  onImportResult: (added: number, skipped: number) => void
}

export function BackupControls({ entries, onMerge, onImportResult }: BackupControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    downloadBackup(entries)
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    try {
      const imported = await readBackupFile(file)
      if (imported.length === 0) {
        onImportResult(0, 0)
        return
      }
      const { merged, added, skipped } = mergeEntries(entries, imported)
      onMerge(merged)
      onImportResult(added, skipped)
    } catch {
      onImportResult(-1, 0)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleExport}
        disabled={entries.length === 0}
        title="导出备份"
        className="rounded-lg px-2 py-1 text-xs text-stone-500 transition hover:bg-stone-100 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        导出
      </button>
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        title="导入备份（合并，不覆盖已有条目）"
        className="rounded-lg px-2 py-1 text-xs text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
      >
        导入
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
