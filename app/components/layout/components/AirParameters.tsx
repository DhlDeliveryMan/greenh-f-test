import { LucideWind } from 'lucide-react'
import React from 'react'
import scale from '../../../assets/icons/scale.svg'
import DualGauge from './DualGauge'
import { useDataContext } from '../../hooks/DataContext'

interface AirParametersProps {}

const AirParameters: React.FC<AirParametersProps> = () => {
  const {  } = useDataContext()

  return (
    <div className="flex items-center flex-col h-full w-full">
      <div className="flex mt-4">
        <LucideWind className="w-7 h-7 mt-[1px]" />
        <h1 className="text-2xl font-bold ml-1">Air Parameters</h1>
      </div>
      <div className="flex justify-between w-full px-6 items-center mt-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Air Temp:</h2>
          <div className="flex text-white">
            <span className="text-4xl font-semibold ">2</span>
            <span className="ml-[2px]">°C</span>
          </div>
        </div>
        <DualGauge value={2} gauge="temperature" />
      </div>
      <div className="flex justify-between w-full px-6 items-center mt-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">Humidity:</h2>
          <div className="flex text-white">
            <span className="text-4xl font-semibold ">22</span>
            <span className="ml-[2px]">%</span>
          </div>
        </div>
        <DualGauge value={2} gauge="humidity" />
      </div>
      <div className="flex justify-between w-full px-6 items-center mt-4">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">CO2:</h2>
          <div className="flex text-white">
            <span className="text-4xl font-semibold ">22</span>
            <span className="ml-[2px]">PPM</span>
          </div>
        </div>
        <DualGauge value={2} gauge="co2" />
      </div>
    </div>
  )
}

export default AirParameters
