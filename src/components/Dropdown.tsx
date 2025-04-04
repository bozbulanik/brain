import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'

interface ActionItem {
  type: 'item'
  label: string
  shortcut: React.ReactNode
  icon: React.ReactNode
  onClick: () => void
  group?: string
}

interface SeparatorItem {
  type: 'separator'
  group?: string
}

interface LabelItem {
  type: 'label'
  label: string
  group: string
}

type DropdownItem = ActionItem | SeparatorItem | LabelItem

interface DropdownProps {
  items: DropdownItem[]
  searchable?: boolean
}

const Dropdown: React.FC<DropdownProps> = ({ items, searchable = false }) => {
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  const matchedActionItems = items.filter((item) => {
    if (item.type !== 'item') return false
    return item.label.toLowerCase().includes(search.toLowerCase())
  }) as ActionItem[]

  const matchedGroups = new Set(
    matchedActionItems
      .map((item) => (item as ActionItem).group)
      .filter((group): group is string => group !== undefined)
  )

  const filteredItems = items.filter((item) => {
    if (item.type === 'item') {
      return item.label.toLowerCase().includes(search.toLowerCase())
    }
    if (item.type === 'label') {
      return matchedGroups.has(item.group)
    }
    if (item.type === 'separator') {
      return item.group && matchedGroups.size > 1 ? matchedGroups.has(item.group) : false
    }
    return false
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        let next = focusedIndex
        do {
          next = (next + 1) % filteredItems.length
        } while (filteredItems[next].type !== 'item')
        setFocusedIndex(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        let prev = focusedIndex
        do {
          prev = (prev - 1 + filteredItems.length) % filteredItems.length
        } while (filteredItems[prev].type !== 'item')
        setFocusedIndex(prev)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const item = filteredItems[focusedIndex]
        if (item.type === 'item') {
          item.onClick()
          setOpen(false)
        }
      } else if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, focusedIndex, filteredItems])

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, searchable])

  return (
    <div className="z-50 absolute right-0 w-32 h-32 top-10 mt-1 my-2 h-8 border border-border dark:border-border-dark bg-[#FCFCFC] dark:bg-[#181818] font-bold hover:bg-[#ECECEC] hover:border-[#D3D3D3] dark:hover:bg-[#252525] dark:hover:border-[#313131] cursor-pointer text-left outline-none flex items-center gap-2 p-2 rounded-md ">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md shadow-lg  `}
            tabIndex={-1}
          >
            {searchable && (
              <div className="w-full border-b border-border dark:border-border-dark flex items-center gap-2 p-1">
                <Search size={14} color="#71717a" />
                <input
                  type="text"
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="focus:outline-none placeholder-text-muted w-full bg-transparent"
                />
              </div>
            )}

            <div className="flex flex-col max-h-60 overflow-y-auto p-1">
              {filteredItems.filter((i) => i.type === 'item').length === 0 ? (
                <div className="px-4 py-2 text-sm text-text-muted">No results</div>
              ) : (
                filteredItems.map((item, index) => {
                  if (item.type === 'separator') {
                    return (
                      <div
                        key={`sep-${index}`}
                        className="border-t border-border dark:border-border-dark my-1"
                      />
                    )
                  }
                  if (item.type === 'label') {
                    return (
                      <div
                        key={`label-${index}`}
                        className="p-1 text-xs text-text-muted uppercase font-bold"
                      >
                        {item.label}
                      </div>
                    )
                  }
                  return (
                    <button
                      key={`item-${index}`}
                      ref={(el) => (itemRefs.current[index] = el)}
                      onClick={() => {
                        item.onClick()
                        setOpen(false)
                      }}
                      onMouseEnter={() => setFocusedIndex(index)}
                      className={`flex items-center justify-between w-full text-sm text-left p-1 rounded-sm hover:bg-hover dark:hover:bg-hover-dark focus:outline-none ${
                        focusedIndex === index ? 'bg-hover dark:bg-hover-dark' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.shortcut}
                    </button>
                  )
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Dropdown
