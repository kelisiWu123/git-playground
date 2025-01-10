import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_SETTINGS, loadSettings } from '../utils/storage'

interface SettingsStore {
  language: string
  setLanguage: (language: string) => void
  resetSettings: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...loadSettings(),

      setLanguage: (language) => set({ language }),
      resetSettings: () => set({ language: DEFAULT_SETTINGS.language }),
    }),
    {
      name: 'git-meow-settings',
    }
  )
)
