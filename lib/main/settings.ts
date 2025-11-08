import fs from 'fs'
import path from 'path'
import { app } from 'electron'

export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue }

const SETTINGS_FILE = 'settings.json'
const SETTINGS_PATH = path.join(app.getPath('userData'), SETTINGS_FILE)

export const createDefaultSettings = (): Record<string, JSONValue> => ({
  General: { showDebug: false },
  Climate: { targetTemp: 22, humidity: 50 },
  Irrigation: { wateringInterval: 30, autoIrrigation: true },
  System: { wifiSSID: '', wifiPassword: '' },
})

export const readSettings = (): Record<string, JSONValue> => {
  try {
    if (!fs.existsSync(SETTINGS_PATH)) {
      const defaults = createDefaultSettings()
      writeSettings(defaults)
      return defaults
    }

    const raw = fs.readFileSync(SETTINGS_PATH, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    console.warn('⚠️ Failed to read settings, recreating defaults:', err)
    const defaults = createDefaultSettings()
    writeSettings(defaults)
    return defaults
  }
}

export const writeSettings = (data: Record<string, JSONValue>) => {
  const dir = path.dirname(SETTINGS_PATH)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(data, null, 2))
}

const updateFieldRecursive = (obj: any, key: string, newValue: JSONValue): boolean => {
  if (obj && typeof obj === 'object') {
    for (const k of Object.keys(obj)) {
      if (k === key) {
        obj[k] = newValue
        return true
      }

      if (typeof obj[k] === 'object' && updateFieldRecursive(obj[k], key, newValue)) {
        return true
      }
    }
  }
  return false
}

export const updateSettings = (changes: Record<string, JSONValue>) => {
  const settings = readSettings()

  for (const [key, value] of Object.entries(changes)) {
    const updated = updateFieldRecursive(settings, key, value)
    if (!updated) {
      console.warn(`⚠️ Key "${key}" not found, adding at root`)
      ;(settings as any)[key] = value
    }
  }

  writeSettings(settings)
}

export const resetSettings = () => {
  const defaults = createDefaultSettings()
  writeSettings(defaults)
  return defaults
}
