import { useEffect, useRef } from 'react'

const QUICK_TAGS = ['#待办', '#灵感', '#复盘', '#笔记'] as const

interface MagicInputProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
  onFocusChange: (focused: boolean) => void
}

export function MagicInput({
  value,
  onChange,
  onSave,
  onFocusChange,
}: MagicInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  function insertTag(tag: string) {
    if (value.includes(tag)) return

    const el = inputRef.current
    const start = el?.selectionStart ?? value.length
    const end = el?.selectionEnd ?? value.length
    const before = value.slice(0, start)
    const after = value.slice(end)
    const prefix = before.length > 0 && !/\s$/.test(before) ? ' ' : ''
    const insert = `${prefix}${tag}`
    const next = before + insert + after

    onChange(next)

    requestAnimationFrame(() => {
      const pos = start + insert.length
      el?.focus()
      el?.setSelectionRange(pos, pos)
    })
  }

  return (
    <div className="border-b border-stone-200 bg-white px-4 py-4 sm:px-6">
      <textarea
        ref={inputRef}
        autoFocus
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => onFocusChange(true)}
        onBlur={() => onFocusChange(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            onSave()
          }
        }}
        rows={3}
        placeholder="随便写点啥..."
        className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-stone-800 placeholder:text-stone-400 focus:outline-none sm:text-lg"
      />
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_TAGS.map((tag) => {
          const active = value.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              disabled={active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertTag(tag)}
              className={`shrink-0 rounded-full px-3 py-1 text-sm transition ${
                active
                  ? 'cursor-default bg-stone-200 text-stone-400'
                  : 'bg-stone-100 text-stone-600 ring-1 ring-stone-200 hover:bg-stone-200'
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
        <span>⌘/Ctrl + Enter 保存</span>
        {value.trim() && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onSave}
            className="rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-white transition hover:bg-stone-700"
          >
            保存
          </button>
        )}
      </div>
    </div>
  )
}
