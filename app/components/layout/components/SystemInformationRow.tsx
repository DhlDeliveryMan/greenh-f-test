import React from 'react'

import cpu from '../../../assets/icons/cpu.svg'
import thermometer from '../../../assets/icons/thermometer.svg'
import memory_stick from '../../../assets/icons/microchip.svg'
import { useDataContext } from '../../hooks/DataContext'

interface SystemInformationRowProps {
  className?: string
}

const safeNumber = (value: unknown): number => {
  const numericValue = Number(value)
  return Number.isFinite(numericValue) ? numericValue : 0
}

const formatForDisplay = (value: number): number => Number(value.toFixed(1))

const getUtilizationColor = (value: number): string => {
  if (!Number.isFinite(value)) return 'text-slate-400'
  if (value >= 85) return 'text-red-600'
  if (value >= 50) return 'text-amber-500'
  return 'text-[#007f46ff]'
}

const getTemperatureColor = (value: number): string => {
  if (!Number.isFinite(value)) return 'text-slate-400'
  if (value >= 85) return 'text-red-600'
  if (value >= 70) return 'text-amber-500'
  return 'text-sky-800'
}

const SystemInformationRow: React.FC<SystemInformationRowProps> = ({ className = '' }) => {
  const { getValue } = useDataContext()

  const cpuUtilRaw = safeNumber(getValue('cpuUtil', 0))
  const cpuUtilDisplay = formatForDisplay(cpuUtilRaw)
  const cpuUtilColor = getUtilizationColor(cpuUtilRaw)

  const cpuTempRaw = safeNumber(getValue('cpuTemp', 0))
  const cpuTempDisplay = formatForDisplay(cpuTempRaw)
  const cpuTempColor = getTemperatureColor(cpuTempRaw)

  const ramUtilRaw = safeNumber(getValue('ramUtil', 0))
  const ramUtilDisplay = formatForDisplay(ramUtilRaw)
  const ramUtilColor = getUtilizationColor(ramUtilRaw)

  return (
    <div className={`grid grid-cols-3 gap-4 w-full justify-items-center items-center mt-12 ${className}`}>
      <div className="flex col-span-1">
        <img src={cpu} className="w-18 h-18" />
        <div className="flex-col ">
          <h2 className="text-xl font-bold">CPU Usage:</h2>
          <div className={`flex ${cpuUtilColor}`}>
            <span className="text-4xl font-semibold ">{cpuUtilDisplay}</span>
            <span className="ml-[2px]">%</span>
          </div>
        </div>
      </div>
      <div className="flex col-span-1">
        <img src={thermometer} className="w-15 h-15 mt-1" />
        <div className="flex-col">
          <h2 className="text-xl font-bold">CPU Temp:</h2>
          <div className={`flex ${cpuTempColor}`}>
            <span className="text-4xl font-semibold ">{cpuTempDisplay}</span>
            <span className="ml-[2px]">°C</span>
          </div>
        </div>
      </div>
      <div className="flex col-span-1">
        <img src={memory_stick} className="w-15 h-15 mt-1 mr-1" />
        <div className="flex-col ">
          <h2 className="text-xl font-bold">RAM Usage:</h2>
          <div className={`flex ${ramUtilColor}`}>
            <span className="text-4xl font-semibold ">{ramUtilDisplay}</span>
            <span className="ml-[2px]">%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemInformationRow
