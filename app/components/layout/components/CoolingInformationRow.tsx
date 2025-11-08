import React from 'react'
import {
  LucideArrowUp,
  LucideDroplet,
  LucideDroplets,
  LucideFan,
  LucideThermometer,
  LucideThermometerSnowflake,
  LucideThermometerSun,
} from 'lucide-react'
import { useDataContext } from '../../hooks/DataContext'

interface CoolingInformationRowProps {
  className?: string
}

const CoolingInformationRow: React.FC<CoolingInformationRowProps> = ({ className = '' }) => {
  const [showTemp, setShowTemp] = React.useState(true)
  const {} = useDataContext()

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowTemp((prev) => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`grid grid-cols-3 w-full justify-items-center items-center mt-12 ${className}`}>
      <div className="flex col-span-1">
        <LucideThermometerSnowflake className="w-15 h-15 mt-1" />
        <div className="flex-col ml-2">
          <h2 className="text-xl font-bold"> Cold Side:</h2>
          <div className="flex text-[#2196f3]">
            <span className="text-4xl font-semibold ">2</span>
            <span className="ml-[2px]">°C</span>
            <LucideArrowUp className="h-6 mr-1 text-[#f44336]" />
          </div>
        </div>
      </div>
      <div className="flex col-span-1">
        <LucideThermometerSun className="w-15 h-15 mt-1" />
        <div className="flex-col ml-2">
          <h2 className="text-xl font-bold"> Warm Side:</h2>
          <div className="flex text-[#f44336]">
            <span className="text-4xl font-semibold ">2</span>
            <span className="ml-[2px]">°C</span>
          </div>
        </div>
      </div>
      {showTemp === true ? (
        <div className="flex col-span-1">
          <LucideDroplets className="w-15 h-15 mt-1" />
          <div className="flex-col ml-1">
            <h2 className="text-xl font-bold">Water temp.:</h2>
            <div className="flex text-[#2196f3] ml-1">
              <span className="text-4xl font-semibold ">2</span>
              <span className="ml-[2px]">°C</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex col-span-1">
          <LucideFan className="w-15 h-15 mt-1" />
          <div className="flex-col ml-1">
            <h2 className="text-xl font-bold">Outside temp.:</h2>
            <div className="flex text-[#FFC107] ml-1">
              <span className="text-4xl font-semibold ">2</span>
              <span className="ml-[2px]">°C</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoolingInformationRow
