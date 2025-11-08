import { ConveyorApi } from '@/lib/preload/shared'

export class SettingsApi extends ConveyorApi {
  updateSettings = (settings: { [x: string]: unknown }) => this.invoke('update-settings', settings)
  readSettings = () => this.invoke('read-settings', undefined)
}
