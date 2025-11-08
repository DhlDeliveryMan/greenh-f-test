import React, { createContext, useContext, useState, ReactNode } from 'react'

type DebugContextType = {
  showDebugMenu: boolean
  setShowDebugMenu: (value: boolean) => void
}

const DebugContext = createContext<DebugContextType | undefined>(undefined)

export const DebugProvider = ({ children }: { children: ReactNode }) => {
  const [showDebugMenu, setShowDebugMenu] = useState(false)

  return <DebugContext.Provider value={{ showDebugMenu, setShowDebugMenu }}>{children}</DebugContext.Provider>
}

export const useDebug = () => {
  const context = useContext(DebugContext)
  if (!context) {
    throw new Error('useDebug must be used within a DebugProvider')
  }
  return context
}
