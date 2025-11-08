// WaterChain.tsx
import { type JSX, type SVGProps, useEffect, useState } from 'react'

type Point = [number, number]

const makeSegments = (points: Point[], props: SVGProps<SVGLineElement>, prefix: string) =>
  points.slice(1).map((point, idx) => {
    const [x1, y1] = points[idx]
    const [x2, y2] = point
    return <line key={`${prefix}-${idx}`} {...props} x1={x1} y1={y1} x2={x2} y2={y2} />
  })

export default function WaterChain(): JSX.Element {
  const W = 960
  const H = 540

  const [dashHot, setDashHot] = useState(0)
  const [dashCold, setDashCold] = useState(0)

  useEffect(() => {
    let rafId: number
    let last = performance.now()

    const step = (time: number) => {
      const dt = time - last
      last = time
      setDashHot((d) => (d - dt * 0.16) % 220)
      setDashCold((d) => (d - dt * 0.11) % 220)
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Placeholder telemetry – wire to DataContext once worker stream is ready.
  const telemetry = {
    hotBufferTemp: 49,
    hotBufferPct: 78,
    mixTemp: 37,
    mixValvePct: 62,
    radiatorFansPct: 74,
    flowRate: 1.9,
    flowPumpPct: 68,
    supplyPumpPct: 73,
    tecColdOut: 6,
    tecMid: 18,
    tecHotOut: 48,
  }

  const coldColor = '#2563eb'
  const hotColor = '#f43f5e'
  const neutral = '#1f2937'
  const pipeWidth = 6
  const dashPattern = '16 20'

  const layout = {
    hotBuffer: { x: 80, y: 50, w: 160, h: 100 },
    mixNode: { x: 380, y: 50, w: 170, h: 100 },
    radiator: { x: 720, y: 90, w: 120, h: 300 },
    fans: { x: 880, y: 90, w: 70, h: 300 },
    valve: { x: 360, y: 220, r: 28 },
    flowMeter: { x: 300, y: 310, r: 32 },
    flowPump: { x: 380, y: 380, r: 32 },
    supplyPump: { x: 560, y: 380, r: 34 },
    tecStack: { x: 100, y: 340, w: 230, h: 160 },
  }

  const coldSegments: Point[] = [
    [layout.radiator.x + layout.radiator.w, layout.radiator.y + 70],
    [layout.fans.x + layout.fans.w, layout.radiator.y + 70],
    [layout.fans.x + layout.fans.w, layout.supplyPump.y - layout.supplyPump.r - 40],
    [layout.supplyPump.x + layout.supplyPump.r + 28, layout.supplyPump.y - layout.supplyPump.r - 40],
    [layout.supplyPump.x + layout.supplyPump.r + 28, layout.supplyPump.y + layout.supplyPump.r + 32],
    [layout.flowPump.x + layout.flowPump.r + 48, layout.supplyPump.y + layout.supplyPump.r + 32],
    [layout.flowPump.x + layout.flowPump.r + 48, layout.flowMeter.y],
    [layout.flowMeter.x + layout.flowMeter.r, layout.flowMeter.y],
    [layout.flowMeter.x - layout.flowMeter.r, layout.flowMeter.y],
    [layout.flowPump.x - layout.flowPump.r - 44, layout.flowMeter.y],
    [layout.flowPump.x - layout.flowPump.r - 44, layout.tecStack.y + layout.tecStack.h - 120],
    [layout.tecStack.x + layout.tecStack.w, layout.tecStack.y + layout.tecStack.h - 120],
    [layout.tecStack.x + layout.tecStack.w, layout.tecStack.y + 24],
    [layout.mixNode.x + layout.mixNode.w / 2, layout.tecStack.y + 24],
    [layout.mixNode.x + layout.mixNode.w / 2, layout.mixNode.y],
    [layout.radiator.x + layout.radiator.w, layout.mixNode.y],
    [layout.radiator.x + layout.radiator.w, layout.radiator.y + 70],
  ]

  const hotSegments: Point[] = [
    [layout.tecStack.x + layout.tecStack.w, layout.tecStack.y + layout.tecStack.h - 28],
    [layout.flowPump.x - layout.flowPump.r - 40, layout.tecStack.y + layout.tecStack.h - 28],
    [layout.flowPump.x - layout.flowPump.r - 40, layout.flowPump.y + layout.flowPump.r + 36],
    [layout.flowPump.x + layout.flowPump.r + 2, layout.flowPump.y + layout.flowPump.r + 36],
    [layout.flowPump.x + layout.flowPump.r + 2, layout.supplyPump.y + layout.supplyPump.r + 36],
    [layout.supplyPump.x - layout.supplyPump.r - 26, layout.supplyPump.y + layout.supplyPump.r + 36],
    [layout.supplyPump.x - layout.supplyPump.r - 26, layout.supplyPump.y],
    [layout.radiator.x - 34, layout.supplyPump.y],
    [layout.radiator.x - 34, layout.radiator.y - 36],
    [layout.mixNode.x + layout.mixNode.w, layout.radiator.y - 36],
    [layout.mixNode.x + layout.mixNode.w, layout.mixNode.y + layout.mixNode.h],
    [layout.mixNode.x, layout.mixNode.y + layout.mixNode.h],
    [layout.mixNode.x, layout.hotBuffer.y + layout.hotBuffer.h / 2],
    [layout.hotBuffer.x + layout.hotBuffer.w, layout.hotBuffer.y + layout.hotBuffer.h / 2],
    [layout.hotBuffer.x + layout.hotBuffer.w, layout.tecStack.y + layout.tecStack.h - 86],
    [layout.tecStack.x - 48, layout.tecStack.y + layout.tecStack.h - 86],
    [layout.tecStack.x - 48, layout.tecStack.y + 40],
    [layout.tecStack.x + layout.tecStack.w, layout.tecStack.y + 40],
    [layout.tecStack.x + layout.tecStack.w, layout.tecStack.y + layout.tecStack.h - 28],
  ]

  const coldLineProps: SVGProps<SVGLineElement> = {
    stroke: coldColor,
    strokeWidth: pipeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: dashPattern,
    strokeDashoffset: dashCold,
    markerEnd: 'url(#arrow-cold)',
    markerMid: 'url(#arrow-cold)',
  }

  const hotLineProps: SVGProps<SVGLineElement> = {
    stroke: hotColor,
    strokeWidth: pipeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeDasharray: dashPattern,
    strokeDashoffset: dashHot,
    markerEnd: 'url(#arrow-hot)',
    markerMid: 'url(#arrow-hot)',
  }

  return (
    <div style={{ width: W, height: H }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ background: 'transparent' }}>
        <defs>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#000000" floodOpacity="0.1" />
          </filter>

          <marker id="arrow-hot" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={hotColor} />
          </marker>

          <marker id="arrow-cold" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill={coldColor} />
          </marker>
        </defs>

        {/* Hot buffer */}
        <g filter="url(#soft)">
          <rect
            x={layout.hotBuffer.x}
            y={layout.hotBuffer.y}
            width={layout.hotBuffer.w}
            height={layout.hotBuffer.h}
            rx={14}
            fill="#fee2e2"
            stroke={hotColor}
            strokeWidth={2}
          />
          <text
            x={layout.hotBuffer.x + layout.hotBuffer.w / 2}
            y={layout.hotBuffer.y + 28}
            textAnchor="middle"
            fill={hotColor}
            fontSize={16}
            fontWeight={700}
          >
            Hot Buffer
          </text>
          <text
            x={layout.hotBuffer.x + layout.hotBuffer.w / 2}
            y={layout.hotBuffer.y + 60}
            textAnchor="middle"
            fill={neutral}
            fontSize={26}
            fontWeight={800}
          >
            {telemetry.hotBufferTemp}°C
          </text>
          <text
            x={layout.hotBuffer.x + layout.hotBuffer.w / 2}
            y={layout.hotBuffer.y + 88}
            textAnchor="middle"
            fill={neutral}
            fontSize={20}
          >
            Pump {telemetry.hotBufferPct}%
          </text>
        </g>

        {/* Mixing block */}
        <g filter="url(#soft)">
          <rect
            x={layout.mixNode.x}
            y={layout.mixNode.y}
            width={layout.mixNode.w}
            height={layout.mixNode.h}
            rx={14}
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth={2}
          />
          <text
            x={layout.mixNode.x + layout.mixNode.w / 2}
            y={layout.mixNode.y + 28}
            textAnchor="middle"
            fill="#b45309"
            fontSize={16}
            fontWeight={700}
          >
            Mixing Valve
          </text>
          <text
            x={layout.mixNode.x + layout.mixNode.w / 2}
            y={layout.mixNode.y + 60}
            textAnchor="middle"
            fill={neutral}
            fontSize={26}
            fontWeight={800}
          >
            {telemetry.mixTemp}°C
          </text>
          <text
            x={layout.mixNode.x + layout.mixNode.w / 2}
            y={layout.mixNode.y + 88}
            textAnchor="middle"
            fill={neutral}
            fontSize={20}
          >
            {telemetry.mixValvePct}%
          </text>
        </g>

        {/* Radiator + fans */}
        <g filter="url(#soft)">
          <rect
            x={layout.radiator.x}
            y={layout.radiator.y}
            width={layout.radiator.w}
            height={layout.radiator.h}
            rx={14}
            fill="#fee2e2"
            stroke={hotColor}
            strokeWidth={2}
          />
          <text
            x={layout.radiator.x + layout.radiator.w / 2}
            y={layout.radiator.y + 32}
            textAnchor="middle"
            fill={hotColor}
            fontSize={18}
            fontWeight={700}
          >
            Radiator
          </text>
        </g>
        <g filter="url(#soft)">
          <rect
            x={layout.fans.x}
            y={layout.fans.y}
            width={layout.fans.w}
            height={layout.fans.h}
            rx={14}
            fill="#e0f2fe"
            stroke={coldColor}
            strokeWidth={2}
          />
          <text
            x={layout.fans.x + layout.fans.w / 2}
            y={layout.fans.y + 32}
            textAnchor="middle"
            fill={coldColor}
            fontSize={18}
            fontWeight={700}
          >
            Fans
          </text>
          <text
            x={layout.fans.x + layout.fans.w / 2}
            y={layout.fans.y + layout.fans.h / 2 + 16}
            textAnchor="middle"
            fill={neutral}
            fontSize={32}
            fontWeight={800}
          >
            {telemetry.radiatorFansPct}%
          </text>
        </g>

        {/* 3-way valve */}
        <g transform={`translate(${layout.valve.x}, ${layout.valve.y})`}>
          <circle r={layout.valve.r} fill="#f8fafc" stroke={neutral} strokeWidth={3} />
          <path d={`M0 ${-layout.valve.r + 6} L8 -6 L-8 -6 Z`} fill={hotColor} opacity={0.85} />
          <path d={`M${layout.valve.r - 6} 0 L6 8 L6 -8 Z`} fill={coldColor} opacity={0.85} />
          <text x={0} y={layout.valve.r + 20} textAnchor="middle" fill={neutral} fontSize={12}>
            3-way valve
          </text>
        </g>

        {/* Flow meter */}
        <g transform={`translate(${layout.flowMeter.x}, ${layout.flowMeter.y})`} filter="url(#soft)">
          <circle r={layout.flowMeter.r} fill="#f8fafc" stroke="#0f172a" strokeWidth={2} />
          <path d="M-18 -4 L18 -4 L12 -18 L0 0 L-12 -18 Z" fill={hotColor} opacity={0.4} />
          <path d="M-18 4 L18 4 L12 18 L0 0 L-12 18 Z" fill={coldColor} opacity={0.4} />
          <text x={0} y={layout.flowMeter.r + 22} textAnchor="middle" fill={neutral} fontSize={12}>
            Flow
          </text>
          <text x={0} y={layout.flowMeter.r + 40} textAnchor="middle" fill={neutral} fontSize={18} fontWeight={700}>
            {telemetry.flowRate.toFixed(2)} L/h
          </text>
        </g>

        {/* Flow pump */}
        <g transform={`translate(${layout.flowPump.x}, ${layout.flowPump.y})`}>
          <circle r={layout.flowPump.r} fill="#cbd5f5" stroke="#1d4ed8" strokeWidth={3} />
          <g>
            <rect x={-4} y={-layout.flowPump.r + 8} width={8} height={layout.flowPump.r * 2 - 16} rx={2} fill="white">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x={-layout.flowPump.r + 8}
              y={-4}
              width={layout.flowPump.r * 2 - 16}
              height={8}
              rx={2}
              fill="white"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="1.4s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
          <text x={0} y={layout.flowPump.r + 26} textAnchor="middle" fill={neutral} fontSize={12}>
            Flow pump
          </text>
          <text x={0} y={layout.flowPump.r + 44} textAnchor="middle" fill={neutral} fontSize={18} fontWeight={700}>
            {telemetry.flowPumpPct}%
          </text>
        </g>

        {/* Supply pump */}
        <g transform={`translate(${layout.supplyPump.x}, ${layout.supplyPump.y})`}>
          <circle r={layout.supplyPump.r} fill="#fee2e2" stroke={hotColor} strokeWidth={3} />
          <g>
            <rect x={-5} y={-layout.supplyPump.r + 10} width={10} height={layout.supplyPump.r * 2 - 20} rx={2} fill="white">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="1.1s"
                repeatCount="indefinite"
              />
            </rect>
            <rect
              x={-layout.supplyPump.r + 10}
              y={-5}
              width={layout.supplyPump.r * 2 - 20}
              height={10}
              rx={2}
              fill="white"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="1.1s"
                repeatCount="indefinite"
              />
            </rect>
          </g>
          <text x={0} y={layout.supplyPump.r + 26} textAnchor="middle" fill={neutral} fontSize={12}>
            Supply pump
          </text>
          <text x={0} y={layout.supplyPump.r + 44} textAnchor="middle" fill={neutral} fontSize={18} fontWeight={700}>
            {telemetry.supplyPumpPct}%
          </text>
        </g>

        {/* TEC stack */}
        <g filter="url(#soft)">
          <rect
            x={layout.tecStack.x}
            y={layout.tecStack.y}
            width={layout.tecStack.w}
            height={layout.tecStack.h}
            rx={16}
            fill="#0f172a"
            stroke="#111827"
            strokeWidth={2}
          />
          <rect
            x={layout.tecStack.x + 16}
            y={layout.tecStack.y + 24}
            width={layout.tecStack.w - 32}
            height={36}
            rx={10}
            fill="#bae6fd"
          />
          <rect
            x={layout.tecStack.x + 16}
            y={layout.tecStack.y + layout.tecStack.h / 2 - 18}
            width={layout.tecStack.w - 32}
            height={36}
            rx={10}
            fill="#f5f5f4"
          />
          <rect
            x={layout.tecStack.x + 16}
            y={layout.tecStack.y + layout.tecStack.h - 60}
            width={layout.tecStack.w - 32}
            height={36}
            rx={10}
            fill="#fecaca"
          />
          <text
            x={layout.tecStack.x + layout.tecStack.w / 2}
            y={layout.tecStack.y + 20}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize={16}
            fontWeight={700}
          >
            TEC Stack
          </text>
          <text
            x={layout.tecStack.x + layout.tecStack.w / 2}
            y={layout.tecStack.y + 48}
            textAnchor="middle"
            fill={coldColor}
            fontSize={18}
          >
            Cold out {telemetry.tecColdOut}°C
          </text>
          <text
            x={layout.tecStack.x + layout.tecStack.w / 2}
            y={layout.tecStack.y + layout.tecStack.h / 2 + 8}
            textAnchor="middle"
            fill="#fbbf24"
            fontSize={18}
          >
            Interface {telemetry.tecMid}°C
          </text>
          <text
            x={layout.tecStack.x + layout.tecStack.w / 2}
            y={layout.tecStack.y + layout.tecStack.h - 32}
            textAnchor="middle"
            fill={hotColor}
            fontSize={18}
          >
            Hot out {telemetry.tecHotOut}°C
          </text>
        </g>

        {/* Sensor call-outs */}
        <g>
          <text x={layout.mixNode.x + layout.mixNode.w + 16} y={layout.mixNode.y + 24} fill={neutral} fontSize={12}>
            Supply sensor
          </text>
          <text x={layout.mixNode.x - 110} y={layout.mixNode.y + layout.mixNode.h + 24} fill={neutral} fontSize={12}>
            Return sensor
          </text>
        </g>

        {/* Pipe work */}
        <g>{makeSegments(coldSegments, coldLineProps, 'cold')}</g>
        <g>{makeSegments(hotSegments, hotLineProps, 'hot')}</g>
      </svg>
    </div>
  )
}
