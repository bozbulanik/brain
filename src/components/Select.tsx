import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronsUpDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchable?: boolean
  className?: string
  disabled?: boolean
}

const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  searchable = false,
  className = '',
  disabled = false
}) => {
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(0)
  const [search, setSearch] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
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
        setFocusedIndex((prev) => (prev + 1) % filteredOptions.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (filteredOptions[focusedIndex]) {
          onChange(filteredOptions[focusedIndex].value)
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
  }, [open, focusedIndex, filteredOptions, onChange])

  useEffect(() => {
    if (open && searchable) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open, searchable])

  useEffect(() => {
    // Reset focus to first item when filtering changes
    if (filteredOptions.length > 0) {
      setFocusedIndex(0)
    }
  }, [filteredOptions.length])

  const handleOpenToggle = () => {
    if (!disabled) {
      setOpen((prev) => !prev)
      setSearch('')
    }
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        onClick={handleOpenToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby="select-label"
        className={`my-1 h-8 border border-border dark:border-border-dark bg-[#FCFCFC] dark:bg-[#181818] hover:bg-[#ECECEC] dark:hover:bg-[#252525] hover:border-[#D3D3D3] dark:hover:border-[#313131] w-full cursor-pointer text-left outline-none flex items-center justify-between gap-2 p-2 rounded-md ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {selectedOption?.icon}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </div>
        <ChevronsUpDown
          size={16}
          strokeWidth={1.5}
          className={`transition-transform duration-200 ${open ? 'transform rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-0 top-full mt-1 w-full bg-background dark:bg-background-dark border border-border dark:border-border-dark rounded-md z-50 ${className}`}
            role="listbox"
            tabIndex={-1}
          >
            {searchable && (
              <div className="w-full border-b border-border dark:border-border-dark flex items-center gap-2 p-1">
                <input
                  type="text"
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="focus:outline-none placeholder-text-muted w-full bg-transparent p-1"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <div className="flex flex-col max-h-60 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-2 text-sm text-text-muted">No options found</div>
              ) : (
                filteredOptions.map((option, index) => (
                  <button
                    key={`option-${option.value}`}
                    onClick={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`cursor-pointer flex items-center justify-between w-full text-sm text-left p-1 rounded-sm hover:bg-hover dark:hover:bg-hover-dark focus:outline-none ${
                      focusedIndex === index ? 'bg-hover dark:bg-hover-dark' : ''
                    } ${option.value === value ? 'font-medium' : ''}`}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <div className="flex items-center gap-2">
                      {option.icon}
                      <span>{option.label}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Select
