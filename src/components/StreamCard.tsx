import { useEffect, useRef, useState } from 'react'
import type { MemoEntry } from '../types/entry'

interface StreamCardProps {
  entry: MemoEntry
  onToggleComplete: (id: string) => void
  onUpdate: (id: string, content: string) => void
  onDeleteRequest: (id: string) => void
}

export function StreamCard({
  entry,
  onToggleComplete,
  onUpdate,
  onDeleteRequest,
}: StreamCardProps) {
  switch (entry.category) {
    case 'todo':
      return (
        <TodoCard
          entry={entry}
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdate}
          onDeleteRequest={onDeleteRequest}
        />
      )
    case 'idea':
      return <IdeaCard entry={entry} onUpdate={onUpdate} onDeleteRequest={onDeleteRequest} />
    case 'review':
      return (
        <ReviewCard entry={entry} onUpdate={onUpdate} onDeleteRequest={onDeleteRequest} />
      )
    default:
      return (
        <DefaultCard entry={entry} onUpdate={onUpdate} onDeleteRequest={onDeleteRequest} />
      )
  }
}

function CardActions({
  onEdit,
  onDeleteRequest,
}: {
  onEdit: () => void
  onDeleteRequest: () => void
}) {
  return (
    <div className="flex shrink-0 items-start gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
      <button
        type="button"
        aria-label="编辑条目"
        onClick={onEdit}
        className="rounded p-1 text-stone-300 transition hover:bg-stone-100 hover:text-stone-600"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
          />
        </svg>
      </button>
      <button
        type="button"
        aria-label="删除条目"
        onClick={onDeleteRequest}
        className="rounded p-1 text-stone-300 transition hover:bg-stone-100 hover:text-red-500"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
  )
}

function EntryEditForm({
  draft,
  onDraftChange,
  onSave,
  onCancel,
}: {
  draft: string
  onDraftChange: (value: string) => void
  onSave: () => void
  onCancel: () => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const len = draft.length
    textareaRef.current?.setSelectionRange(len, len)
  }, [draft])

  return (
    <div className="min-w-0 flex-1">
      <textarea
        ref={textareaRef}
        value={draft}
        onChange={(e) => onDraftChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            onSave()
          }
          if (e.key === 'Escape') {
            e.preventDefault()
            onCancel()
          }
        }}
        rows={3}
        className="w-full resize-none rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm leading-relaxed text-stone-700 focus:border-stone-400 focus:outline-none sm:text-base"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-stone-400">⌘/Ctrl + Enter 保存 · Esc 取消</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg px-3 py-1 text-xs text-stone-500 transition hover:bg-stone-100"
          >
            取消
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!draft.trim()}
            className="rounded-lg bg-stone-800 px-3 py-1 text-xs font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  )
}

function useCardEdit(entry: MemoEntry, onUpdate: (id: string, content: string) => void) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(entry.content)

  useEffect(() => {
    if (!isEditing) setDraft(entry.content)
  }, [entry.content, isEditing])

  function startEdit() {
    setDraft(entry.content)
    setIsEditing(true)
  }

  function cancelEdit() {
    setDraft(entry.content)
    setIsEditing(false)
  }

  function saveEdit() {
    if (!draft.trim()) return
    onUpdate(entry.id, draft)
    setIsEditing(false)
  }

  return { isEditing, draft, setDraft, startEdit, cancelEdit, saveEdit }
}

function TodoCard({
  entry,
  onToggleComplete,
  onUpdate,
  onDeleteRequest,
}: {
  entry: MemoEntry
  onToggleComplete: (id: string) => void
  onUpdate: (id: string, content: string) => void
  onDeleteRequest: (id: string) => void
}) {
  const edit = useCardEdit(entry, onUpdate)

  return (
    <div className="group flex items-start gap-3 rounded-xl bg-white px-4 py-3 ring-1 ring-stone-200">
      {!edit.isEditing && (
        <button
          type="button"
          aria-label={entry.isCompleted ? '标记为未完成' : '标记为已完成'}
          onClick={() => onToggleComplete(entry.id)}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
            entry.isCompleted
              ? 'border-stone-400 bg-stone-400'
              : 'border-stone-300 hover:border-stone-500'
          }`}
        >
          {entry.isCompleted && (
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>
      )}
      {edit.isEditing ? (
        <EntryEditForm
          draft={edit.draft}
          onDraftChange={edit.setDraft}
          onSave={edit.saveEdit}
          onCancel={edit.cancelEdit}
        />
      ) : (
        <>
          <p
            className={`min-w-0 flex-1 cursor-text text-sm leading-relaxed sm:text-base ${
              entry.isCompleted ? 'text-stone-400 line-through' : 'text-stone-700'
            }`}
            onClick={edit.startEdit}
          >
            {entry.content}
          </p>
          <CardActions
            onEdit={edit.startEdit}
            onDeleteRequest={() => onDeleteRequest(entry.id)}
          />
        </>
      )}
    </div>
  )
}

function IdeaCard({
  entry,
  onUpdate,
  onDeleteRequest,
}: {
  entry: MemoEntry
  onUpdate: (id: string, content: string) => void
  onDeleteRequest: (id: string) => void
}) {
  const edit = useCardEdit(entry, onUpdate)

  return (
    <div className="group flex items-start gap-2 rounded-xl border border-violet-200/80 bg-gradient-to-br from-violet-50 to-fuchsia-50/50 px-4 py-3 shadow-sm shadow-violet-100/50">
      {edit.isEditing ? (
        <EntryEditForm
          draft={edit.draft}
          onDraftChange={edit.setDraft}
          onSave={edit.saveEdit}
          onCancel={edit.cancelEdit}
        />
      ) : (
        <>
          <p
            className="min-w-0 flex-1 cursor-text text-sm leading-relaxed text-stone-700 sm:text-base"
            onClick={edit.startEdit}
          >
            {entry.content}
          </p>
          <CardActions
            onEdit={edit.startEdit}
            onDeleteRequest={() => onDeleteRequest(entry.id)}
          />
        </>
      )}
    </div>
  )
}

function ReviewCard({
  entry,
  onUpdate,
  onDeleteRequest,
}: {
  entry: MemoEntry
  onUpdate: (id: string, content: string) => void
  onDeleteRequest: (id: string) => void
}) {
  const edit = useCardEdit(entry, onUpdate)

  return (
    <div className="group flex items-start gap-2 rounded-xl border-l-4 border-amber-300/80 bg-amber-50/40 px-4 py-3">
      {edit.isEditing ? (
        <EntryEditForm
          draft={edit.draft}
          onDraftChange={edit.setDraft}
          onSave={edit.saveEdit}
          onCancel={edit.cancelEdit}
        />
      ) : (
        <>
          <p
            className="min-w-0 flex-1 cursor-text text-sm leading-relaxed font-medium text-stone-700 sm:text-base"
            onClick={edit.startEdit}
          >
            <span className="mr-1 text-amber-400/80">&ldquo;</span>
            {entry.content}
          </p>
          <CardActions
            onEdit={edit.startEdit}
            onDeleteRequest={() => onDeleteRequest(entry.id)}
          />
        </>
      )}
    </div>
  )
}

function DefaultCard({
  entry,
  onUpdate,
  onDeleteRequest,
}: {
  entry: MemoEntry
  onUpdate: (id: string, content: string) => void
  onDeleteRequest: (id: string) => void
}) {
  const edit = useCardEdit(entry, onUpdate)

  return (
    <div className="group flex items-start gap-2 rounded-xl bg-white px-4 py-3 ring-1 ring-stone-200">
      {edit.isEditing ? (
        <EntryEditForm
          draft={edit.draft}
          onDraftChange={edit.setDraft}
          onSave={edit.saveEdit}
          onCancel={edit.cancelEdit}
        />
      ) : (
        <>
          <p
            className="min-w-0 flex-1 cursor-text text-sm leading-relaxed text-stone-700 sm:text-base"
            onClick={edit.startEdit}
          >
            {entry.content}
          </p>
          <CardActions
            onEdit={edit.startEdit}
            onDeleteRequest={() => onDeleteRequest(entry.id)}
          />
        </>
      )}
    </div>
  )
}
