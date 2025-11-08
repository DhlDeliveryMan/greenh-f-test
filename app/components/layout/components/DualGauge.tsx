import React, { useState } from 'react'
import { GaugeComponent } from 'react-gauge-component'

interface IMultiSegmentGauge {
  value: number
  gauge: 'temperature' | 'humidity' | 'co2'
}

const gaugeSettings = [
  {
    type: 'temperature',
    min: 0,
    max: 38,
    segments: [
      { limit: 9, color: '#EA4228' }, // red
      { limit: 14, color: '#F5CD19' }, // yellow
      { limit: 25, color: '#5BE12C' }, // green
      { limit: 30, color: '#F5CD19' }, // yellow
      { color: '#EA4228' },
    ],
  },
  {
    type: 'humidity',
    min: 0,
    max: 100,
    segments: [
      { limit: 20, color: '#EA4228' }, // red
      { limit: 50, color: '#F5CD19' }, // yellow
      { limit: 55, color: '#5BE12C' }, // green
      { limit: 80, color: '#F5CD19' }, // yellow
      { color: '#EA4228' },
    ],
  },
  {
    type: 'co2',
    min: 0,
    max: 2000,
    segments: [
      { limit: 0, color: '#EA4228' }, // red
      { limit: 800, color: '#F5CD19' }, // yellow
      { limit: 1300, color: '#5BE12C' }, // green
      { limit: 1500, color: '#F5CD19' }, // yellow
      { color: '#EA4228' },
    ],
  },
]

const MultiSegmentGauge: React.FC<IMultiSegmentGauge> = ({ value, gauge }) => {
  const gaugeConfig = gaugeSettings.find((g) => g.type === gauge)

  return (
    <>
      <div className="flex items-center justify-center bg-white rounded-full w-[80px] h-[80px]  ">
        <div className="flex items-center justify-center bg-primary rounded-full w-[74px] h-[74px]">
          <GaugeComponent
            type="radial"
            marginInPercent={0.0929}
            style={{ width: 300, height: 130 }}
            arc={{
              nbSubArcs: 5,
              width: 0.09,
              padding: 0,
              cornerRadius: 0,
              subArcs: gaugeConfig!.segments,
            }}
            pointer={{
              color: '#A9885C',
              length: 0.6,
              width: 7,
            }}
            value={value}
            minValue={gaugeConfig?.min}
            maxValue={gaugeConfig?.max}
            labels={{
              tickLabels: {
                hideMinMax: true,
              },
              valueLabel: {
                hide: true,
              },
            }}
          />
        </div>
      </div>
    </>
  )
}

export default MultiSegmentGauge
