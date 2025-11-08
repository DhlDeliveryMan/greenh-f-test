import React, { createContext, useContext, useState, ReactNode } from 'react'

export type TelemetryType =
  | 'temperature'
  | 'humidity'
  | 'soil_moisture'
  | 'co2'
  | 'tvoc'
  | 'air_temperature'
  | 'water_flow'
  | 'switch_position'
  | 'utilization'
  | 'utitlization'
  | (string & {})

export interface ITelemetryPoint {
  id: string
  type: TelemetryType
  value: number
  timestamp: string
}

export interface DataContextType {
  telemetry: Record<string, ITelemetryPoint>
  latestReading: ITelemetryPoint | null
  getReading: (id: string) => ITelemetryPoint | undefined
  getValue: (id: string, fallback?: number) => number | undefined
  statusCodes: Status[]
  setStatusCodes: React.Dispatch<React.SetStateAction<Status[]>>
}

export const STATUS_LIST = {
  'Self-Testing': '#FFC107',
  Idling: '#a0a0a0',
  Irrigating: '#007f46ff',
  'Fan ON': '#ff9800',
  Chilling: '#2196f3',
  'Pre-Chilling': '#03a9f4',
  Heating: '#f44336',
  'Pre-Heating': '#ff5722',
  'Cold Loop': '#03a9f4',
  'Hot Loop': '#f44336',
  '(DE) Humidif.': '#9c27b0',
  'Pumps (1-3)': '#007f46ff',
}

export type Status = keyof typeof STATUS_LIST

interface IAirParameters {
  temperature: number
  humidity: number
  co2: number
}

interface IFanParameters {
  speed: number
  status: boolean
}

interface ITecStackParameters {
  dutyCycle: number
  tempHotSide: number
  tempColdSide: number
  tempOutlet: number
  tempEclosure: number
  tecHeatsinkFans: IFanParameters
  tecEnclosureFans: IFanParameters
  totalPower: number
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [telemetry, setTelemetry] = useState<Record<string, ITelemetryPoint>>({})
  const [latestReading, setLatestReading] = useState<ITelemetryPoint | null>(null)
  const [statusCodes, setStatusCodes] = useState<Status[]>([])

  React.useEffect(() => {
    const listener = (payload: ITelemetryPoint | ITelemetryPoint[]) => {
      const points = Array.isArray(payload) ? payload : [payload]
      if (points.length === 0) return

      setLatestReading(points[points.length - 1])

      setTelemetry((prev) => {
        const next = { ...prev }
        let changed = false

        for (const point of points) {
          if (next[point.id] !== point) {
            next[point.id] = point
            changed = true
          }
        }

        return changed ? next : prev
      })
    }

    window.api.receive('sensor-data', listener)
    return () => window.api.removeAllListeners('sensor-data')
  }, [])

  const getReading = React.useCallback(
    (id: string) => {
      return telemetry[id]
    },
    [telemetry]
  )

  const getValue = React.useCallback(
    (id: string, fallback?: number) => {
      const reading = telemetry[id]
      if (reading === undefined) {
        return fallback
      }
      return reading.value
    },
    [telemetry]
  )

  const contextValue = React.useMemo<DataContextType>(
    () => ({
      telemetry,
      latestReading,
      getReading,
      getValue,
      statusCodes,
      setStatusCodes,
    }),
    [telemetry, latestReading, getReading, getValue, statusCodes]
  )

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
}

export const useDataContext = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider')
  }
  return context
}
