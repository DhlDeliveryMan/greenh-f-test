import { flattenSettings } from '@/app/helpers/settingsFunction'
import { useConveyor } from '@/app/hooks/use-conveyor'
import React, { createContext, useContext, useState, ReactNode } from 'react'

type FlatSettings = {
  'General.debugMode': boolean
}

interface SettingsContextType {
  settings: FlatSettings | undefined
}

interface SettingsProviderProps {
  children: ReactNode
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useState<FlatSettings | undefined>(undefined)

  const settingsApi = useConveyor('settings')

  React.useEffect(() => {
    updateSettings()
  }, [])

  const updateSettings = async () => {
    const settingsData = await settingsApi.readSettings()
    const flatSettings = flattenSettings(settingsData)

    setSettings(flatSettings as FlatSettings)

    console.log('Loaded Settings:', flatSettings)
  }

  return <SettingsContext.Provider value={{ settings }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}
