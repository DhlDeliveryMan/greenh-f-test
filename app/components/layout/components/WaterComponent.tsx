import React from 'react'
import res_warm from '../../../assets/icons/warm_res_icon.svg'
import res_cold from '../../../assets/icons/cold_res_icon.svg'
import water_droplet from '../../../assets/icons/droplet-solid-full.svg'
import flow from '../../../assets/icons/flow_icon.svg'
import water_level from '../../../assets/icons/water_level_icon.svg'

const WaterComponent: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center  border-2 border-[#a9885c] rounded-md">
      <div className="flex">
        <img src={water_droplet} className="w-7 h-7 mt-1 " />
        <h1 className="text-2xl font-bold mt-[2px]">Water Parameters</h1>
      </div>
      <div className="flex flex-row justify-between py-4 w-full">
        <div className="flex justify-center items-center ">
          <img src={res_warm} className="w-26 h-20" />
          <div className="flex flex-col ml-1">
            <span className="text-md font-semibold">W. Res. Temp:</span>
            <div className="flex text-[#fd0707ff]">
              <span className="text-4xl font-semibold ">49</span>
              <span className="ml-[2px]">°C</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <img src={res_cold} className="w-26 h-20" />
          <div className="flex flex-col ml-1">
            <span className="text-md font-semibold">C. Res. Temp:</span>
            <div className="flex text-[#0026ffff]">
              <span className="text-4xl font-semibold ">7</span>
              <span className="ml-[2px]">°C</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center ">
          <img src={flow} className="w-26 h-20" />
          <div className="flex flex-col ml-1">
            <span className="text-md font-semibold">Flow Rate:</span>
            <div className="flex text-[#007f46ff]">
              <span className="text-4xl font-semibold ">1.89</span>
              <span className="ml-[2px]">L/h</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center mr-2">
          <img src={water_level} className="w-26 h-20" />
          <div className="flex flex-col ml-1">
            <span className="text-md font-semibold">Water LvL:</span>
            <div className="flex text-[#cccccc]">
              <span className="text-4xl font-semibold ">67</span>
              <span className="ml-[2px]">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaterComponent
