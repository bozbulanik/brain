import {
  Calendar,
  ChartArea,
  ChevronUp,
  Copy,
  CornerDownLeft,
  Edit,
  FolderIcon,
  MoreHorizontal,
  Music,
  Notebook,
  NotebookText,
  Pen,
  Pin,
  PinOff,
  Plus,
  Settings,
  SquareArrowOutUpRight,
  Trash,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/store'
import { useNavigate } from 'react-router-dom'

type SelectableItem = {
  id: string
  type: string
  title?: string
  action?: () => void
  ref?: React.RefObject<HTMLButtonElement>
  pinned?: boolean
}

const SearchPage = () => {
  const logs = useStore((state) => state.logs)
  const searchItems = useStore((state) => state.searchItems)
  const pinItem = useStore((state) => state.pinItem)
  const unpinItem = useStore((state) => state.unpinItem)
  const deleteItem = useStore((state) => state.deleteItem)

  const navigate = useNavigate()

  const inputRef = useRef<HTMLInputElement>(null)
  const calendarRef = useRef<HTMLButtonElement>(null)
  const analyticsRef = useRef<HTMLButtonElement>(null)
  const settingsRef = useRef<HTMLButtonElement>(null)

  const pinnedContainerRef = useRef<HTMLDivElement>(null)
  const resultsContainerRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchItems>>([])
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null)
  const [clickedItemId, setClickedItemId] = useState<string | null>(null)
  const [dropdownSelectedIndex, setDropdownSelectedIndex] = useState(0)

  useEffect(() => {
    setSearchResults(searchItems(query))
  }, [query, logs, searchItems])

  const handleNavigate = (id: string) => {
    navigate(`/logs/${id}`)
  }
  const pinnedItems = searchResults.filter((item) => item.pinned)
  const unpinnedItems = searchResults.filter((item) => !item.pinned)

  const getNavigationItems = (): SelectableItem[] => {
    const navButtons: SelectableItem[] = [
      {
        id: 'calendar',
        type: 'navigation',
        title: 'Calendar',
        action: () => window.ipcRenderer.invoke('openWindow', 'calendar'),
        ref: calendarRef
      },
      {
        id: 'analytics',
        type: 'navigation',
        title: 'Analytics',
        action: () => window.ipcRenderer.invoke('openWindow', 'analytics'),
        ref: analyticsRef
      },
      {
        id: 'settings',
        type: 'navigation',
        title: 'Settings',
        action: () => window.ipcRenderer.invoke('openWindow', 'settings'),
        ref: settingsRef
      }
    ]
    const pinnedResultItems: SelectableItem[] = pinnedItems.map((item) => ({
      ...item,
      action: () => handleNavigate(item.id)
    }))

    const resultItems: SelectableItem[] = unpinnedItems.map((item) => ({
      ...item,
      action: () => handleNavigate(item.id)
    }))

    return [...navButtons, ...pinnedResultItems, ...resultItems]
  }

  const allItems = getNavigationItems()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const navigationCount = 3 // Calendar, Analytics and Settings
  const pinnedCount = pinnedItems.length
  const isPinnedSection = (index: number) =>
    index >= navigationCount && index < navigationCount + pinnedCount
  const isSearchResultSection = (index: number) => index >= navigationCount + pinnedCount

  useEffect(() => {
    if (clickedItemId) {
      setDropdownSelectedIndex(0)
    }
  }, [clickedItemId])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clickedItemId &&
        !(event.target as Element).closest('.dropdown-menu') &&
        !(event.target as Element).closest('.more-button')
      ) {
        setClickedItemId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [clickedItemId])

  const scrollToSelected = () => {
    if (selectedIndex < navigationCount) {
      allItems[selectedIndex].ref?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    } else if (isPinnedSection(selectedIndex)) {
      // Pinned items
      if (pinnedContainerRef.current) {
        const pinnedIndex = selectedIndex - navigationCount
        const pinnedElements = pinnedContainerRef.current.querySelectorAll('.pinned-item')
        if (pinnedElements[pinnedIndex]) {
          pinnedElements[pinnedIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }
      }
    } else if (isSearchResultSection(selectedIndex)) {
      // Search results
      if (resultsContainerRef.current) {
        const resultIndex = selectedIndex - (navigationCount + pinnedCount)
        const resultElements = resultsContainerRef.current.querySelectorAll('.result-item')
        if (resultElements[resultIndex]) {
          resultElements[resultIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
          })
        }
      }
    }
  }

  const getDropdownOptions = (itemId: string) => {
    const isPinned = pinnedItems.some((item) => item.id === itemId)

    if (isPinned) {
      return [
        {
          label: 'Open',
          icon: <SquareArrowOutUpRight size={16} />,
          action: () => handleOpen(itemId),
          shortcut: (
            <div className="ml-auto flex gap-1">
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                <CornerDownLeft size={14} />
              </div>
            </div>
          )
        },
        {
          label: 'Unpin',
          icon: <PinOff size={16} />,
          action: () => handleUnpin(itemId),
          shortcut: (
            <div className="ml-auto flex gap-1">
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                <CornerDownLeft size={14} />
              </div>
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                P
              </div>
            </div>
          )
        },
        {
          label: 'Delete',
          icon: <Trash size={16} />,
          action: () => handleDelete(itemId),
          danger: true,
          shortcut: (
            <div className="ml-auto flex gap-1 text-text dark:text-text-dark">
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                <CornerDownLeft size={14} />
              </div>
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                D
              </div>
            </div>
          )
        }
      ]
    } else {
      return [
        {
          label: 'Open',
          icon: <SquareArrowOutUpRight size={16} />,
          action: () => handleOpen(itemId),
          shortcut: (
            <div className="ml-auto flex gap-1">
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                <CornerDownLeft size={14} />
              </div>
            </div>
          )
        },
        {
          label: 'Pin',
          icon: <Pin size={16} />,
          action: () => handlePin(itemId),
          shortcut: (
            <div className="ml-auto flex gap-1">
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                <CornerDownLeft size={14} />
              </div>
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                P
              </div>
            </div>
          )
        },
        {
          label: 'Delete',
          icon: <Trash size={16} />,
          action: () => handleDelete(itemId),
          danger: true,
          shortcut: (
            <div className="ml-auto flex gap-1 text-text dark:text-text-dark">
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                <CornerDownLeft size={14} />
              </div>
              <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
                D
              </div>
            </div>
          )
        }
      ]
    }
  }
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // If dropdown is open, handle dropdown navigation
      if (clickedItemId) {
        const options = getDropdownOptions(clickedItemId)

        switch (event.key) {
          case 'Escape':
            event.preventDefault()
            setClickedItemId(null)
            break
          case 'ArrowDown':
            event.preventDefault()
            setDropdownSelectedIndex((prev) => (prev + 1) % options.length)
            break
          case 'ArrowUp':
            event.preventDefault()
            setDropdownSelectedIndex((prev) => (prev - 1 + options.length) % options.length)
            break
          case 'Enter':
            event.preventDefault()
            options[dropdownSelectedIndex].action()
            break
          default:
            break
        }
      } else {
        // Regular navigation when dropdown is closed
        if (allItems.length === 0) return

        if (event.key === 'Escape') {
          event.preventDefault()
          if (query === '') {
            window.ipcRenderer.invoke('closeWindow', 'search')
          } else {
            setQuery('')
          }
        } else if (event.key === 'ArrowDown') {
          event.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % allItems.length)
        } else if (event.key === 'ArrowUp') {
          event.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length)
        } else if (event.key === 'Enter') {
          event.preventDefault()
          if (allItems[selectedIndex]) {
            allItems[selectedIndex].action?.()
          }
        } else if (event.key === 'Tab' && event.shiftKey) {
          // Open dropdown for the currently selected item
          const currentItem = allItems[selectedIndex]
          if (
            currentItem &&
            currentItem.id !== 'calendar' &&
            currentItem.id !== 'analytics' &&
            currentItem.id !== 'settings'
          ) {
            event.preventDefault()
            setClickedItemId(currentItem.id)
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [allItems, selectedIndex, clickedItemId, query, dropdownSelectedIndex])

  useEffect(() => {
    scrollToSelected()
  }, [selectedIndex])

  const getIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <Notebook size={16} />
      case 'audio':
        return <Music size={16} />
      case 'task':
        return <NotebookText size={16} />
      case 'collection':
        return <FolderIcon size={16} />
      case 'navigation':
        return null
      default:
        return <NotebookText size={16} />
    }
  }

  const shouldShowPinnedSection = pinnedItems.length > 0

  const handlePin = (id: string) => {
    pinItem(id)
    setSearchResults(searchItems(query))
    setClickedItemId(null)
  }

  const handleUnpin = (id: string) => {
    unpinItem(id)
    setSearchResults(searchItems(query))
    setClickedItemId(null)
  }

  const handleOpen = (id: string) => {
    handleNavigate(id)
    setClickedItemId(null)
  }

  const handleDelete = (id: string) => {
    deleteItem(id)
    setSearchResults(searchItems(query))
    setClickedItemId(null)
  }

  const renderDropdownMenu = (itemId: string) => {
    if (itemId !== clickedItemId) return null

    const options = getDropdownOptions(itemId)

    return (
      <div className="dropdown-menu absolute right-9 top-2 z-10 bg-background dark:bg-background-dark shadow-lg dark:shadow-zinc-900 rounded-md border border-border dark:border-border-dark min-w-42">
        <div className="flex flex-col p-1">
          {options.map((option, index) => {
            const isSelected = dropdownSelectedIndex === index
            const isDanger = option.danger

            const baseStyle = 'flex w-full items-center gap-2 p-1 text-sm rounded-sm'
            const selectedStyle = isSelected
              ? isDanger
                ? 'bg-red-100/50 dark:bg-red-900/50 text-text dark:text-text-dark'
                : 'bg-hover/50 dark:bg-hover-dark/50'
              : ''

            const hoverStyle = isDanger
              ? 'hover:bg-red-100 hover:dark:bg-red-900'
              : 'hover:bg-hover dark:hover:bg-hover-dark'

            return (
              <button
                key={option.label}
                onClick={option.action}
                className={`${baseStyle} ${selectedStyle} ${hoverStyle}`}
              >
                {option.icon} <span>{option.label}</span>
                {option.shortcut}
              </button>
            )
          })}
        </div>
      </div>
    )
  }
  return (
    <div className="w-full h-full">
      <div className="flex flex-col w-full h-full">
        <div className="h-12 w-full border-b border-border dark:border-border-dark flex items-center gap-2 py-1 px-2">
          <input
            tabIndex={0}
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            type="text"
            placeholder="Search..."
            className="focus:outline-none placeholder-text-muted w-full bg-transparent p-2"
          />
          <button
            onClick={() => {
              if (query === '') {
                window.ipcRenderer.invoke('closeWindow', 'search')
              } else {
                setQuery(''), inputRef.current?.focus()
              }
            }}
            className="p-1 cursor-pointer rounded-full flex items-center border border-button-border dark:border-button-border-dark bg-button dark:bg-button-dark hover:bg-button-hover hover:border-button-border-hover dark:hover:bg-button-hover-dark dark:hover:border-button-border-hover-dark"
          >
            <X size={12} />
          </button>
        </div>
        <div className="p-2 flex flex-col bg-secondary-background dark:bg-secondary-background-dark border-b border-border dark:border-border-dark">
          <div className="uppercase text-text-muted font-bold text-sm">Go to</div>
          <div className="flex gap-2 p-1">
            {allItems.slice(0, navigationCount).map((button, index) => (
              <button
                key={button.id}
                ref={button.ref}
                onClick={button.action}
                className={`cursor-pointer flex gap-2 text-xs font-bold border border-button-border dark:border-button-border-dark ${
                  selectedIndex === index
                    ? 'bg-button-hover dark:bg-button-hover-dark'
                    : 'bg-button dark:bg-button-dark hover:bg-button-hover hover:border-button-border-hover dark:hover:bg-button-hover-dark dark:hover:border-button-border-hover-dark'
                } p-2 rounded-md`}
              >
                {button.id === 'calendar' && <Calendar size={16} />}
                {button.id === 'analytics' && <ChartArea size={16} />}
                {button.id === 'settings' && <Settings size={16} />}
                <span>{button.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-auto min-h-0 h-full">
          {shouldShowPinnedSection && (
            <div
              className="p-2 flex flex-col border-b border-border dark:border-border-dark"
              ref={pinnedContainerRef}
            >
              <div className="uppercase text-text-muted font-bold text-sm">Pinned</div>
              {pinnedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative pinned-item transition-color ease-out duration-400 flex rounded-sm items-center w-full ${
                    selectedIndex === navigationCount + index
                      ? 'bg-hover dark:bg-hover-dark'
                      : 'hover:bg-hover dark:hover:bg-hover-dark'
                  } `}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className="cursor-pointer flex items-center justify-between w-full text-sm text-left p-1 gap-2 rounded-sm focus:outline-none"
                  >
                    <div className="text-xs font-bold border border-button-border dark:border-button-border-dark bg-button dark:bg-button-dark hover:bg-button-hover hover:border-button-border-hover dark:hover:bg-button-hover-dark dark:hover:border-button-border-hover-dark p-2 rounded-md">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-bold">{item.title || `Untitled`}</div>
                      <div className="text-xs text-text-muted dark:text-text-muted-dark">
                        {new Date().toLocaleString()}
                      </div>
                    </div>
                  </button>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setClickedItemId(item.id === clickedItemId ? null : item.id)
                      }}
                      className={`cursor-pointer more-button text-xs font-bold border border-button-border-hover dark:border-button-border-hover-dark bg-button dark:bg-button-dark hover:bg-button-hover dark:hover:bg-button-hover-dark p-1 rounded-md ${
                        hoveredItemId === item.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  {renderDropdownMenu(item.id)}
                </div>
              ))}
            </div>
          )}

          <div className="p-2 flex flex-col" ref={resultsContainerRef}>
            <div className="uppercase text-text-muted font-bold text-sm">All logs</div>
            {unpinnedItems.length > 0 ? (
              unpinnedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`relative result-item transition-color ease-out duration-400 flex rounded-sm items-center w-full ${
                    selectedIndex === navigationCount + pinnedCount + index
                      ? 'bg-hover dark:bg-hover-dark'
                      : 'hover:bg-hover dark:hover:bg-hover-dark'
                  } `}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className="cursor-pointer flex items-center w-full justify-between text-sm text-left p-1 gap-2 focus:outline-none"
                  >
                    <div className="text-xs font-bold border border-button-border dark:border-button-border-dark bg-button dark:bg-button-dark hover:bg-button-hover hover:border-button-border-hover dark:hover:bg-button-hover-dark dark:hover:border-button-border-hover-dark p-2 rounded-md">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="truncate font-bold">{item.title || `Untitled`}</div>
                      <div className="text-xs text-text-muted dark:text-text-muted-dark">
                        {new Date().toLocaleString()}
                      </div>
                    </div>
                  </button>
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setClickedItemId(item.id === clickedItemId ? null : item.id)
                      }}
                      className={`cursor-pointer more-button text-xs font-bold border border-button-border-hover dark:border-button-border-hover-dark bg-button dark:bg-button-dark hover:bg-button-hover dark:hover:bg-button-hover-dark p-1 rounded-md ${
                        hoveredItemId === item.id ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  {renderDropdownMenu(item.id)}
                </div>
              ))
            ) : (
              <div className="text-center text-text-muted dark:text-text-muted-dark py-2">
                No results found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage

// {
//   item.id === clickedItemId && (
//     <div className="absolute right-9 top-2 z-10 bg-background dark:bg-background-dark shadow-lg rounded-md border border-border dark:border-border-dark min-w-42">
//       <div className="flex flex-col p-1">
//         <button
//           onClick={() => handleEdit(item.id)}
//           className="flex w-full items-center gap-2 p-1 rounded-sm text-sm hover:bg-hover dark:hover:bg-hover-dark"
//         >
//           <SquareArrowOutUpRight size={16} /> <span>Open</span>
//           <div className="ml-auto flex gap-1">
//             <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
//               <CornerDownLeft size={14} />
//             </div>
//           </div>
//         </button>
//         <button
//           onClick={() => handlePin(item.id)}
//           className="flex w-full items-center gap-2 p-1 rounded-sm text-sm hover:bg-hover dark:hover:bg-hover-dark"
//         >
//           <Pin size={16} /> <span>Pin</span>
//           <div className="ml-auto flex gap-1">
//             <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
//               <ChevronUp size={14} />
//             </div>
//             <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
//               P
//             </div>
//           </div>
//         </button>

//         <button
//           onClick={() => handleDelete(item.id)}
//           className="flex w-full items-center gap-2 p-1 rounded-sm text-sm text-red-500 hover:bg-hover dark:hover:bg-hover-dark"
//         >
//           <Trash size={16} /> <span>Delete</span>
//           <div className="ml-auto flex gap-1 text-text dark:text-text-dark">
//             <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
//               <ChevronUp size={14} />
//             </div>
//             <div className="h-5 w-5 flex items-center justify-center p-1 bg-hover dark:bg-hover-dark rounded">
//               D
//             </div>
//           </div>
//         </button>
//       </div>
//     </div>
//   )
// }
