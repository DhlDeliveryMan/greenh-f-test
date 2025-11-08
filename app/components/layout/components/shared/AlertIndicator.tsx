import { useAnnouncements } from '@/app/components/hooks/AnnouncementsContext'
import { LucideFlame, LucideSnowflake } from 'lucide-react'

interface IAltertIndicatorProps {
  type: AltertType
  location: string
  severity: 'low' | 'medium' | 'high' | 'informative'
  message: string
  sensorId?: number
  threshold?: number
  currentValue?: number
}

type AltertType = 'overtemp' | 'undertemp' | 'fan_failure' | 'high_humidity' | 'high_co2' | 'power_failure'

export const AlertIndicator = ({ type, severity, message }: IAltertIndicatorProps) => {
  const { addAnnouncement } = useAnnouncements()

  const determineColor = (severity: 'low' | 'medium' | 'high' | 'informative') => {
    switch (severity) {
      case 'low':
        return 'text-amber-300'
      case 'medium':
        return 'text-amber-600'
      case 'high':
        return 'text-red-800'
      case 'informative':
        return 'text-sky-700'
      default:
        return 'text-amber-500'
    }
  }

  const generateAnnouncement = () => {
    addAnnouncement({
      title: type === 'overtemp' ? 'Over Temperature Alert' : 'Under Temperature Alert',
      message,
      type: severity === 'low' ? 'warning' : severity === 'medium' ? 'error' : severity === 'high' ? 'error' : 'info',
      icon: type === 'overtemp' ? <LucideFlame className="w-6 h-6" /> : <LucideSnowflake className="w-6 h-6" />,
      displayInTopBar: false,
      duration: severity === 'low' ? 5000 : severity === 'medium' ? 10000 : 15000,
      id: Date.now() + Math.random(),
      timestamp: Date.now(),
    })
  }

  const generateElement = (type: AltertType) => {
    switch (type) {
      case 'overtemp':
        return (
          <LucideFlame
            className={`w-8 h-8 inline ${determineColor(severity)}`}
            onClick={() => generateAnnouncement()}
          />
        )
      case 'undertemp':
        return (
          <LucideSnowflake
            className={`w-8 h-8 inline ${determineColor(severity)}`}
            onClick={() => generateAnnouncement()}
          />
        )

      default:
        return <></>
    }
  }

  return <>{generateElement(type)}</>
}
