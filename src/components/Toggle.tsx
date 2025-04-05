import React, { useState } from 'react'
import { twMerge } from 'tailwind-merge'

interface ToggleProps {
  className?: string
  name?: string
  onText: string
  offText: string
  reversed?: boolean
}

const Toggle: React.FC<ToggleProps> = ({ className, name, onText, offText, reversed }) => {
  const [isChecked, setIsChecked] = useState(false)

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked)
  }

  return (
    <>
      <label
        className={twMerge(
          'relative inline-flex cursor-pointer select-none items-center my-1',
          className,
          reversed ? 'flex-row-reverse' : ''
        )}
      >
        <input
          type="checkbox"
          name={name}
          className="sr-only"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        <span
          className={twMerge(
            'flex h-6 w-12 items-center rounded-full p-1 duration-200 border',
            isChecked
              ? 'bg-button-hover dark:bg-button-hover-dark border-button-border-hover dark:border-button-border-hover-dark'
              : 'bg-button dark:bg-button-dark border-button-border dark:border-button-border-dark',
            reversed ? 'ml-3' : 'mr-3'
          )}
        >
          <span
            className={`h-4 w-4 rounded-full bg-secondary-background-dark/10 dark:bg-secondary-background/10 border border-border dark:border-border-dark duration-200 ${
              isChecked
                ? 'translate-x-6 bg-secondary-background-dark/40 dark:bg-secondary-background/40'
                : ''
            }`}
          ></span>
        </span>
        <span className="flex items-center text-sm">
          <span> {isChecked ? onText : offText} </span>
        </span>
      </label>
    </>
  )
}

export default Toggle
