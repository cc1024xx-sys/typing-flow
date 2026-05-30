import { useEffect, useMemo, useState } from 'react'
import { BackupControls } from './components/BackupControls'
import { ConfirmDialog } from './components/ConfirmDialog'
import { MagicInput } from './components/MagicInput'
import { SandboxStream } from './components/SandboxStream'
import { SearchBar } from './components/SearchBar'
import { TagFilterBar } from './components/TagFilterBar'
import { filterEntries } from './lib/filterEntries'
import { getUniqueTags } from './lib/groupByDay'
import { createEntry, updateEntryContent } from './lib/parseEntry'
import { loadEntries, saveEntries } from './lib/storage'
import type { MemoEntry } from './types/entry'

function App() {
  const [entries, setEntries] = useState<MemoEntry[]>(() => loadEntries())
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  useEffect(() => {
    saveEntries(entries)
  }, [entries])

  useEffect(() => {
    if (activeTag && !entries.some((e) => e.tags.includes(activeTag))) {
      setActiveTag(null)
    }
  }, [entries, activeTag])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const allTags = useMemo(() => getUniqueTags(entries), [entries])

  const visibleEntries = useMemo(
    () => filterEntries(entries, activeTag, searchQuery),
    [entries, activeTag, searchQuery],
  )

  const hasFilters = activeTag !== null || searchQuery.trim().length > 0
  const isComposing = isFocused && inputValue.length > 0

  function handleSave() {
    if (!inputValue.trim()) return
    const entry = createEntry(inputValue)
    setEntries((prev) => [entry, ...prev])
    setInputValue('')
  }

  function handleToggleComplete(id: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, isCompleted: !e.isCompleted } : e)),
    )
  }

  function handleUpdate(id: string, content: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? updateEntryContent(e, content) : e)),
    )
  }

  function handleDeleteRequest(id: string) {
    setPendingDeleteId(id)
  }

  function handleDeleteConfirm() {
    if (!pendingDeleteId) return
    setEntries((prev) => prev.filter((e) => e.id !== pendingDeleteId))
    setPendingDeleteId(null)
  }

  const pendingDeleteEntry = pendingDeleteId
    ? entries.find((e) => e.id === pendingDeleteId)
    : null

  function handleImportResult(added: number, skipped: number) {
    if (added === -1) {
      setToast('导入失败，请检查文件格式')
      return
    }
    if (added === 0 && skipped === 0) {
      setToast('文件中没有可导入的有效条目')
      return
    }
    if (skipped === 0) {
      setToast(`已导入 ${added} 条新记录`)
    } else {
      setToast(`已导入 ${added} 条，跳过 ${skipped} 条重复记录`)
    }
  }

  return (
    <div className="relative mx-auto flex min-h-dvh max-w-3xl flex-col bg-stone-100">
      <header className="flex items-start justify-between border-b border-stone-200 bg-white px-4 py-3 sm:px-6">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-stone-800">Typing Flow</h1>
          <p className="text-xs text-stone-400">打开即写 · 标签分流 · Little Wins</p>
        </div>
        <BackupControls
          entries={entries}
          onMerge={setEntries}
          onImportResult={handleImportResult}
        />
      </header>

      <MagicInput
        value={inputValue}
        onChange={setInputValue}
        onSave={handleSave}
        onFocusChange={setIsFocused}
      />

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      <TagFilterBar tags={allTags} activeTag={activeTag} onTagChange={setActiveTag} />

      <SandboxStream
        entries={visibleEntries}
        dimmed={isComposing}
        hasFilters={hasFilters}
        onToggleComplete={handleToggleComplete}
        onUpdate={handleUpdate}
        onDeleteRequest={handleDeleteRequest}
      />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="确认删除"
        message={
          pendingDeleteEntry
            ? `确定要删除这条记录吗？\n「${pendingDeleteEntry.content.slice(0, 60)}${pendingDeleteEntry.content.length > 60 ? '…' : ''}」`
            : '确定要删除这条记录吗？'
        }
        confirmLabel="删除"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPendingDeleteId(null)}
      />

      {toast && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-800 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

export default App
