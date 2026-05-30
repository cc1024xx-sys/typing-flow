export type Category = 'todo' | 'idea' | 'review' | 'note' | 'daily'

export interface MemoEntry {
  id: string
  content: string
  category: Category
  tags: string[]
  isCompleted: boolean
  createdAt: number
}
