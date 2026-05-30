import { useEffect, useRef } from 'react'

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
        placeholder="今天有什么 Little Win？#待办 #灵感 #复盘 #笔记 ..."
        className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-stone-800 placeholder:text-stone-400 focus:outline-none sm:text-lg"
      />
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
