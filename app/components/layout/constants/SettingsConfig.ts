import { LucideSettings, LucideFlower, LucideDroplets, LucideMonitorCog } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

export interface SettingFieldDef {
  id: string
  label: string
  type: 'text' | 'password' | 'number' | 'boolean' | 'select'
  options?: string[]
  unit?: string
}

export interface SettingSection {
  icon: LucideIcon
  fields: SettingFieldDef[]
}

export const SETTINGS_CONFIG: Record<string, SettingSection> = {
  General: {
    icon: LucideSettings,
    fields: [{ id: 'showDebug', label: 'Show Debug Info', type: 'boolean' }],
  },
  Climate: {
    icon: LucideFlower,
    fields: [
      { id: 'targetTemp', label: 'Target Temperature', type: 'number', unit: '°C' },
      { id: 'humidity', label: 'Target Humidity', type: 'number', unit: '%' },
    ],
  },
  Irrigation: {
    icon: LucideDroplets,
    fields: [
      { id: 'wateringInterval', label: 'Watering Interval', type: 'number', unit: 'min' },
      { id: 'autoIrrigation', label: 'Enable Auto Irrigation', type: 'boolean' },
    ],
  },
  System: {
    icon: LucideMonitorCog,
    fields: [
      { id: 'wifiSSID', label: 'Wi-Fi SSID', type: 'text' },
      { id: 'wifiPassword', label: 'Wi-Fi Password', type: 'password' },
    ],
  },
}
