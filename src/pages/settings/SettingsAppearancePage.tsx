import { useContext, useEffect, useState } from 'react'
import Select from '../../components/Select'
import { twMerge } from 'tailwind-merge'
import { useSettingsStore } from '../../store/settingsStore'

const SettingsAppearancePage = () => {
  const { settings, setSetting } = useSettingsStore()

  const changeView = (view: string) => {
    console.log('test')
  }
  const viewOptions = [
    { value: 'option0', label: 'Inter' },
    { value: 'option1', label: 'Ubuntu' },
    { value: 'option2', label: 'System' }
  ]

  const setDarkTheme = () => {
    setSetting('theme', 'dark')
  }

  const setLightTheme = () => {
    setSetting('theme', 'light')
  }

  return (
    <div className="w-full h-full px-2">
      <div className="w-full h-full flex flex-col gap-4">
        <div>
          <div className="uppercase text-text-muted font-bold text-sm">Font</div>
          <Select options={viewOptions} value="option0" onChange={changeView} />
        </div>

        <div>
          <div className="uppercase text-text-muted font-bold text-sm">Theme</div>
          <div className="flex gap-4 py-2">
            <div className="flex flex-col items-center">
              <div
                className={twMerge(
                  'cursor-pointer p-1 w-52 h-32 flex items-center rounded-lg',
                  settings.theme === 'light'
                    ? 'border border-border-dark dark:border-border'
                    : 'hover:border hover:border-border-dark dark:hover:border-border'
                )}
                onClick={setLightTheme}
              >
                <div className="p-2 w-full h-full bg-secondary-background rounded-md flex flex-col gap-2">
                  <div className="h-8 w-full border border-border rounded-lg flex flex-col gap-1 p-1 items-left justify-center">
                    <div className="rounded-lg w-[50%] bg-border h-2"></div>
                    <div className="rounded-lg w-[75%] bg-border h-2"></div>
                  </div>
                  <div className="h-8 w-full border border-border rounded-lg flex gap-1 p-1 items-center">
                    <div className="bg-border rounded-full h-3 w-3"></div>
                    <div className="rounded-lg w-[75%] bg-border h-2"></div>
                  </div>
                  <div className="h-8 w-full border border-border rounded-lg flex gap-1 p-1 items-center">
                    <div className="bg-border rounded-full h-3 w-3"></div>
                    <div className="rounded-lg w-[75%] bg-border h-2"></div>
                  </div>
                </div>
              </div>
              <p>Light</p>
            </div>
            <div className="flex flex-col items-center ">
              <div
                className={twMerge(
                  'cursor-pointer p-1 w-52 h-32 flex items-center rounded-lg',
                  settings.theme === 'dark'
                    ? 'border border-border-dark dark:border-border'
                    : 'hover:border hover:border-border-dark dark:hover:border-border'
                )}
                onClick={setDarkTheme}
              >
                <div className="p-2 w-full h-full bg-secondary-background-dark rounded-md flex flex-col gap-2">
                  <div className="h-8 w-full border border-border-dark rounded-lg flex flex-col gap-1 p-1 items-left justify-center">
                    <div className="rounded-lg w-[50%] bg-border-dark h-2"></div>
                    <div className="rounded-lg w-[75%] bg-border-dark h-2"></div>
                  </div>
                  <div className="h-8 w-full border border-border-dark rounded-lg flex gap-1 p-1 items-center">
                    <div className="bg-border-dark rounded-full h-3 w-3"></div>
                    <div className="rounded-lg w-[75%] bg-border-dark h-2"></div>
                  </div>
                  <div className="h-8 w-full border border-border-dark rounded-lg flex gap-1 p-1 items-center">
                    <div className="bg-border-dark rounded-full h-3 w-3"></div>
                    <div className="rounded-lg w-[75%] bg-border-dark h-2"></div>
                  </div>
                </div>
              </div>
              <p>Dark</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsAppearancePage
