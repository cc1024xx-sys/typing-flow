import type { MemoEntry } from '../types/entry'

export function filterEntries(
  entries: MemoEntry[],
  activeTag: string | null,
  searchQuery: string,
): MemoEntry[] {
  let result = entries

  if (activeTag) {
    result = result.filter((e) => e.tags.includes(activeTag))
  }

  const query = searchQuery.trim().toLowerCase()
  if (query) {
    result = result.filter(
      (e) =>
        e.content.toLowerCase().includes(query) ||
        e.tags.some((tag) => tag.toLowerCase().includes(query)),
    )
  }

  return result
}
