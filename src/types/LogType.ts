// Type
// Relation
// Type is also a type
// How can we create customized logs?
// properties
// string, number, date property

export type LogType =
  | 'note'
  | 'task'
  | 'collection'
  | 'event'
  | 'journal'
  | 'document'
  | 'bookmark'
  | 'expense'
  | 'shoppingitem'
  | 'physicalitem'
  | 'nutritionaldata'
  | 'workout'
  | 'habit'

export interface Log {
  id: number
  title?: string
  content: string
  createdAt: Date
  updatedAt: Date
  pinned: boolean
  properties: []
}

export interface Note extends Log {
  type: 'note'
}
export interface Task extends Log {
  type: 'task'
  priority: number //0 low, 1 medium, 2 high
  due: Date
}

export interface Collection extends Log {
  type: 'collection'
  collectionType: LogType
  children?: [] // ID's of logs
}

export interface Event extends Log {
  type: 'event'
  from: Date
  to?: Date
  continuous?: boolean
  icon?: React.ReactNode
}
export interface JournalEntry extends Log {
  type: 'journal'
}
export interface Document extends Log {
  type: 'document'
}
export interface Bookmark extends Log {
  type: 'bookmark'
}
export interface Expense extends Log {
  type: 'expense'
}
export interface ShoppingItem extends Log {
  type: 'shoppingitem'
}
export interface PhysicalItem extends Log {
  type: 'physicalitem'
}
export interface NutritionalData extends Log {
  type: 'nutritionaldata'
}
export interface Workout extends Log {
  type: 'workout'
}
export interface Habit extends Log {
  type: 'habit'
}
