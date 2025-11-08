import React, { createContext, useCallback, useContext, useState } from 'react'

export type AltertType = 'overtemp' | 'undertemp' | 'fan_failure' | 'high_humidity' | 'high_co2' | 'power_failure'

export interface IAltertIndicator {
  id: string
  type: AltertType
  location: string
  severity: 'low' | 'medium' | 'high' | 'informative'
  message: string
  timestamp: number
  sensorId?: number
  threshold?: number
  currentValue?: number
}

type WarningsContextValue = {
  warnings: IAltertIndicator[]
  addWarning: (input: Partial<IAltertIndicator>) => string
  removeWarning: (id: string) => void
  clearWarnings: () => void
}

const WarningsContext = createContext<WarningsContextValue | undefined>(undefined)

export const WarningsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [warnings, setWarnings] = useState<IAltertIndicator[]>([])

  const generateId = React.useCallback(
    () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`,
    []
  )

  const createWarning = React.useCallback(
    (input: Partial<IAltertIndicator>): IAltertIndicator => {
      const id = input.id ?? generateId()
      return {
        id,
        message: input.message ?? '',
        severity: input.severity ?? 'informative',
        timestamp: input.timestamp ?? Date.now(),
        type: input.type ?? 'overtemp',
        location: input.location ?? '',
        sensorId: input.sensorId,
        threshold: input.threshold,
        currentValue: input.currentValue,
      }
    },
    [generateId]
  )

  const addWarning = useCallback(
    (input: Partial<IAltertIndicator>) => {
      const item = createWarning(input)
      setWarnings((prev) => [...prev, item])
      return item.id
    },
    [createWarning]
  )

  const removeWarning = useCallback((id: string) => {
    setWarnings((prev) => prev.filter((w) => w.id !== id))
  }, [])

  const clearWarnings = useCallback(() => {
    setWarnings([])
  }, [])

  React.useEffect(() => {
    if (!window?.api) {
      return
    }

    let ignore = false

    const loadCachedWarnings = async () => {
      try {
        const cached = await window.api.invoke('get-worker-warnings')
        if (ignore || !Array.isArray(cached)) {
          return
        }

        setWarnings((prev) => {
          if (cached.length === 0) {
            return prev
          }

          const existingIds = new Set(prev.map((warning) => warning.id))
          const merged = [...prev]

          cached.forEach((rawWarning) => {
            const normalized = createWarning(rawWarning)

            if (existingIds.has(normalized.id)) {
              const index = merged.findIndex((warning) => warning.id === normalized.id)
              if (index !== -1) {
                merged[index] = normalized
              }
            } else {
              existingIds.add(normalized.id)
              merged.push(normalized)
            }
          })

          return merged
        })
      } catch (error) {
        console.error('Failed to load cached warnings', error)
      }
    }

    loadCachedWarnings()

    const listener = (warning: Partial<IAltertIndicator>) => {
      addWarning(warning)
    }

    window.api.receive('worker-warning', listener)
    return () => {
      ignore = true
      window.api.removeAllListeners('worker-warning')
    }
  }, [addWarning, createWarning])

  return (
    <WarningsContext.Provider value={{ warnings, addWarning, removeWarning, clearWarnings }}>
      {children}
    </WarningsContext.Provider>
  )
}

export const useWarnings = (): WarningsContextValue => {
  const ctx = useContext(WarningsContext)
  if (!ctx) {
    throw new Error('useWarnings must be used within a WarningsProvider')
  }
  return ctx
}

export default WarningsContext
