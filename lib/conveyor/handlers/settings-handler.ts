import { JSONValue, readSettings, updateSettings } from '@/lib/main/settings'
import { handle } from '@/lib/main/shared'
import { App } from 'electron'

export const registerSettingsHandlers = (app: App) => {
  handle('update-settings', (changes: { [x: string]: unknown }) => {
    updateSettings(changes as Record<string, JSONValue>)
  })

  handle('read-settings', () => {
    return readSettings()
  })
}
