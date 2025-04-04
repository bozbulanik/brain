// Type
// Relation
// Type is also a type

export type LogType = 'note' | 'task' | 'collection' | 'event'

export interface Log {
  id: string
  type: LogType
  title?: string
  content: string
  createdAt: Date
  updatedAt: Date
  children?: Log[]
  pinned?: boolean
}

export interface Event extends Log {
  type: 'event'
  from: Date
  to: Date
  icon?: React.ReactNode
}
