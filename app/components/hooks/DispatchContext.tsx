// dispatchcontext.tsx
import { useConveyor } from '@/app/hooks/use-conveyor'
import { ipcRenderer } from 'electron'
import React, { createContext, useContext, ReactNode } from 'react'

// Generic dispatch event type
export type DispatchEvent = {
  type: string
  payload?: any
}

export type ConnectionStatus = {
  worker: { status: 'connected' | 'connecting' | 'disconnected'; error?: string }
  rs485: { status: 'connected' | 'fail' | 'disconnected'; error?: string }
}

// Context interface
interface DispatchContextType {
  dispatch: (event: DispatchEvent) => void
  connectionStatus: ConnectionStatus
}

// Create context
const DispatchContext = createContext<DispatchContextType | undefined>(undefined)

// Provider component
export const DispatchProvider = ({ children }: { children: ReactNode }) => {
  const { app } = useConveyor()
  const [connectionStatus, setConnectionStatus] = React.useState<ConnectionStatus>({
    worker: { status: 'disconnected' },
    rs485: { status: 'disconnected' },
  })
  // Dispatch function to send events to Electron
  const dispatch = (event: DispatchEvent) => {}

  React.useEffect(() => {
    async function fetchStatus() {
      const status = await window.api.invoke('get-worker-status')
      setConnectionStatus(status)
    }
    fetchStatus()

    const listener = (status: ConnectionStatus) => {
      console.log('Worker status update:', status)
      setConnectionStatus(status)
    }

    window.api.receive('worker-status', listener)
    return () => {
      window.api.removeAllListeners('worker-status')
      window.api.removeAllListeners('get-worker-status')
    }
  }, [])

  return <DispatchContext.Provider value={{ dispatch, connectionStatus }}>{children}</DispatchContext.Provider>
}

// Hook to use dispatch
export const useDispatch = () => {
  const context = useContext(DispatchContext)
  if (!context) {
    throw new Error('useDispatchContext must be used within a DispatchProvider')
  }
  return context
}
