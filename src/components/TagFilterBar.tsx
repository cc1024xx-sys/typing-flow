interface TagFilterBarProps {
  tags: string[]
  activeTag: string | null
  onTagChange: (tag: string | null) => void
}

export function TagFilterBar({ tags, activeTag, onTagChange }: TagFilterBarProps) {
  if (tags.length === 0) return null

  return (
    <div className="border-b border-stone-200 bg-stone-50 px-4 py-3 sm:px-6">
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <TagButton
          label="全部"
          active={activeTag === null}
          onClick={() => onTagChange(null)}
        />
        {tags.map((tag) => (
          <TagButton
            key={tag}
            label={`#${tag}`}
            active={activeTag === tag}
            onClick={() => onTagChange(activeTag === tag ? null : tag)}
          />
        ))}
      </div>
    </div>
  )
}

function TagButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-3 py-1 text-sm transition ${
        active
          ? 'bg-stone-800 text-white'
          : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100'
      }`}
    >
      {label}
    </button>
  )
}
