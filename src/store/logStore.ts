import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { Event, Log } from '../types/LogType'
import { Cake } from 'lucide-react'
import React from 'react'

interface AppState {
  logs: Log[]
  addNote: (title: string, content: string) => string
  updateNote: (id: string, updates: Partial<Log>) => void
  deleteItem: (id: string) => void
  pinItem: (id: string) => void
  unpinItem: (id: string) => void
  searchItems: (query: string) => Log[]
  getEvents: () => Log[]
}

const EventData: Event[] = [
  {
    id: crypto.randomUUID(),
    type: 'event',
    title: 'Meeting',
    content: 'Meeting with someone',
    createdAt: new Date(),
    updatedAt: new Date(),
    from: new Date('2025-04-05T09:50:21.817Z'),
    to: new Date('2025-04-05T09:50:21.817Z')
  },
  {
    id: crypto.randomUUID(),
    type: 'event',
    title: 'Meeting',
    content: 'Test',
    createdAt: new Date(),
    updatedAt: new Date(),
    from: new Date('2025-04-05T09:50:21.817Z'),
    to: new Date('2025-04-05T09:50:21.817Z')
  },
  {
    id: crypto.randomUUID(),
    type: 'event',
    title: 'Meeting',
    content: 'Test',
    createdAt: new Date(),
    updatedAt: new Date(),
    from: new Date('2025-04-05T09:50:21.817Z'),
    to: new Date('2025-04-05T09:50:21.817Z')
  },
  {
    id: crypto.randomUUID(),
    type: 'event',
    title: 'Meeting',
    content: 'Test',
    createdAt: new Date(),
    updatedAt: new Date(),
    from: new Date('2025-04-05T09:50:21.817Z'),
    to: new Date('2025-04-05T09:50:21.817Z')
  },
  {
    id: crypto.randomUUID(),
    type: 'event',
    title: 'Meeting',
    content: 'Test2',
    createdAt: new Date(),
    updatedAt: new Date(),
    from: new Date('2025-04-05T09:50:21.817Z'),
    to: new Date('2025-04-05T09:50:21.817Z')
  },
  {
    id: crypto.randomUUID(),
    type: 'event',
    title: 'Birthday',
    content: 'Birthday',
    createdAt: new Date(),
    updatedAt: new Date(),
    from: new Date('2025-04-05T09:50:21.817Z'),
    to: new Date('2025-04-05T09:50:21.817Z'),
    icon: React.createElement(
      'div',
      {
        style: { padding: '0.25rem' }
      },
      React.createElement(Cake, {
        style: { width: '16px', height: '16px' }
      })
    )
  }
]

const LogData: Log[] = [
  ...EventData,
  {
    id: crypto.randomUUID(),
    type: 'note',
    title: 'Note1',
    content: 'TestNote',
    createdAt: new Date(),
    updatedAt: new Date(),
    pinned: true
  },
  {
    id: crypto.randomUUID(),
    type: 'task',
    content: 'TestTask',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: crypto.randomUUID(),
    type: 'collection',
    content: 'TestCollection',
    createdAt: new Date(),
    updatedAt: new Date(),
    children: [
      {
        id: crypto.randomUUID(),
        type: 'note',
        content: 'TestNoteInCollection',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: crypto.randomUUID(),
        type: 'task',
        content: 'TestTaskInCollection',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  }
]

export const useLogStore = create<AppState>((set, get) => ({
  logs: LogData,
  sidebarItems: ['1', '2'],

  addNote: (title, content) => {
    const id = uuidv4()
    const log: Log = {
      id,
      type: 'note',
      title,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    set((state) => ({ logs: [...state.logs, log] }))
    return id
  },

  updateNote: (id, updates) => {
    set((state) => ({
      logs: state.logs.map((log) =>
        log.id === id ? { ...log, ...updates, updatedAt: new Date() } : log
      )
    }))
  },

  deleteItem: (id) => {
    set((state) => ({
      logs: state.logs.filter((log) => log.id !== id)
    }))
  },

  pinItem: (id) => {
    set((state) => ({
      logs: state.logs.map((log) => (log.id === id ? { ...log, pinned: true } : log))
    }))
  },

  // Add unpin function
  unpinItem: (id) => {
    set((state) => ({
      logs: state.logs.map((log) => (log.id === id ? { ...log, pinned: false } : log))
    }))
  },

  searchItems: (query) => {
    query = query.toLowerCase()
    const { logs } = get()

    const filteredLogs = logs.filter(
      (log) => log.title?.toLowerCase().includes(query) || log.content.toLowerCase().includes(query)
    )

    return [...filteredLogs]
  },
  getEvents: () => {
    const { logs } = get()
    const eventLogs = logs.filter((log) => log.type == 'event')
    return [...eventLogs]
  }
}))
