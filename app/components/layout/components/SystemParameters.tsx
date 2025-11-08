import React, { JSX, useState } from 'react'
import lightning_bolt from '../../../assets/icons/lightning-bolt.svg'
import {
  LucideCloudMoon,
  LucideCloudy,
  LucideSun,
  LucideSunDim,
  LucideSunMedium,
  LucideSunrise,
  LucideSunset,
  LucideWarehouse,
} from 'lucide-react'
import SystemInformationRow from './SystemInformationRow'
import CoolingInformationRow from './CoolingInformationRow'
import { set } from 'zod'
import { Status, STATUS_LIST, useDataContext } from '../../hooks/DataContext'
import { useDebug } from '../../hooks/DebugContext'
import DebugMenu from './DebugMenu'
import { useViews } from '../../hooks/ViewsContext'
import AnnouncementModal from './AnnouncementModal'

interface PlantLightStep {
  time: string // Time range
  cct: number // Target color temperature in Kelvin
  mix2700: number // % of 2700K LED
  mix6500: number // % of 6500K LED
  dim: number // Dimmed intensity (%)
  dutyCycle: number // PWM duty cycle (%)
  colorHex: string // Approximate display color in HEX
  icon: JSX.Element | string // Icon representing the time of day
  description: string // Human-readable description
}

export const plantLightingSchedule: PlantLightStep[] = [
  {
    time: '05-07',
    cct: 3000,
    mix2700: 82,
    mix6500: 18,
    dim: 30,
    dutyCycle: 30,
    colorHex: '#FF9F6C', // vivid sunrise orange
    icon: <LucideSunrise className="h-16 w-16" />,
    description: 'Sunrise',
  },
  {
    time: '07-09',
    cct: 4000,
    mix2700: 66,
    mix6500: 34,
    dim: 60,
    dutyCycle: 60,
    colorHex: '#FFD27F', // bright morning yellow-orange
    icon: <LucideSunDim className="h-16 w-16" />,
    description: 'Morning',
  },
  {
    time: '09-13',
    cct: 5500,
    mix2700: 21,
    mix6500: 79,
    dim: 100,
    dutyCycle: 100,
    colorHex: '#A6D8FF', // soft sky-blue
    icon: <LucideSunMedium className="h-16 w-16" />,
    description: 'Noon',
  },
  {
    time: '13-17',
    cct: 5000,
    mix2700: 29,
    mix6500: 71,
    dim: 90,
    dutyCycle: 90,
    colorHex: '#87CFFF', // light blue afternoon
    icon: <LucideSun className="h-16 w-16" />,
    description: 'Afternoon',
  },
  {
    time: '17-19',
    cct: 3500,
    mix2700: 76,
    mix6500: 24,
    dim: 50,
    dutyCycle: 50,
    colorHex: '#FFB371', // vivid sunset orange-pink
    icon: <LucideSunset className="h-16 w-16" />,
    description: 'Sunset',
  },
  {
    time: '19-21',
    cct: 2700,
    mix2700: 100,
    mix6500: 0,
    dim: 20,
    dutyCycle: 20,
    colorHex: '#FF8F5A', // evening warm orange
    icon: <LucideCloudy className="h-16 w-16" />,
    description: 'Evening',
  },
  {
    time: '21-05',
    cct: 0,
    mix2700: 0,
    mix6500: 0,
    dim: 0,
    dutyCycle: 0,
    colorHex: '#4A557F', // deep dark blue for night
    icon: <LucideCloudMoon className="h-16 w-16" />,
    description: 'Night',
  },
]

const MAX_PER_COLUMN = 4

const SystemParameters: React.FC = () => {
  const [currentLightStep, setCurrentLightStep] = React.useState<PlantLightStep | null>(plantLightingSchedule[0])

  const { statusCodes, setStatusCodes } = useDataContext()
  const { displayedTopMenu } = useViews()

  React.useEffect(() => {
    let stepIndex = 0
    setCurrentLightStep(plantLightingSchedule[stepIndex])

    const interval = setInterval(() => {
      stepIndex = (stepIndex + 1) % plantLightingSchedule.length
      setCurrentLightStep(plantLightingSchedule[stepIndex])
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const columns: Status[][] = []
  const numColumns = Math.ceil(statusCodes.length / MAX_PER_COLUMN)

  for (let col = 0; col < numColumns; col++) {
    const column: Status[] = []
    for (let row = 0; row < MAX_PER_COLUMN; row++) {
      const index = row + col * MAX_PER_COLUMN
      if (statusCodes[index]) column.push(statusCodes[index])
    }
    columns.push(column)
  }

  return (
    <div>
      {/* Floating Menu Toggle Button */}

      <div className="flex justify-center items-center mt-4">
        <img src={lightning_bolt} className="w-7 h-7" />
        <h1 className="text-3xl font-bold">System Parameters</h1>
      </div>

      {displayedTopMenu === 'cooling' ? <CoolingInformationRow /> : <SystemInformationRow />}

      {/* Bottom row: 2 columns, centered under the grid */}
      <div className="flex justify-center gap-16 mt-8">
        <div className="flex">
          <div className="mr-3 mt-2">{currentLightStep?.icon}</div>
          <div className="flex-col ">
            <h2 className="text-xl font-bold">Lighting:</h2>
            <div className="flex-col text-white text-sm leading-4 font-semibold ml-1">
              <p className="">Status: {currentLightStep?.description}</p>
              <p>
                Temp: <span style={{ color: currentLightStep?.colorHex }}>{currentLightStep?.cct} K°</span>
              </p>
              <p>Brightness: {currentLightStep?.dim}%</p>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="mr-3 mt-2">
            <LucideWarehouse className="w-16 h-16" />
          </div>
          <div className="flex-col ">
            <h2 className="text-xl font-bold">GH Status:</h2>
            <div className="flex gap-4 ml-1">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col leading-4 text-sm">
                  {column.map((status, rowIndex) => (
                    <p key={rowIndex} style={{ color: STATUS_LIST[status] }}>
                      {status}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemParameters
