import { create } from 'zustand'

export interface SettingsSchema {
  theme: 'light' | 'dark'
}

interface SettingsStore {
  settings: SettingsSchema
  initialized: boolean

  initializeSettings: () => Promise<void>
  setSetting: <K extends keyof SettingsSchema>(key: K, value: SettingsSchema[K]) => Promise<void>
  resetSettings: () => Promise<void>
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: {
    theme: 'light'
  },
  initialized: false,

  initializeSettings: async () => {
    try {
      const settings = await window.ipcRenderer.invoke('getSettings')
      set({ settings, initialized: true })
    } catch (error) {
      console.error('Failed to initialize settings:', error)
    }
  },

  setSetting: async (key, value) => {
    try {
      await window.ipcRenderer.invoke('setSettings', key as string, value)
      set((state) => ({
        settings: { ...state.settings, [key]: value }
      }))
    } catch (error) {
      console.error(`Failed to update setting ${String(key)}:`, error)
    }
  },

  resetSettings: async () => {
    try {
      await window.ipcRenderer.invoke('resetSettings')
      const defaultSettings = await window.ipcRenderer.invoke('getSettings')
      set({ settings: defaultSettings })
    } catch (error) {
      console.error('Failed to reset settings:', error)
    }
  }
}))
