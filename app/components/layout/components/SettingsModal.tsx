import React from 'react'
import { useViews } from '../../hooks/ViewsContext'
import { SETTINGS_CONFIG } from '../constants/SettingsConfig'
import { SettingField } from './shared/SettingsField'
import { LucideCog } from 'lucide-react'
import { useConveyor } from '@/app/hooks/use-conveyor'
import { flattenSettings } from '@/app/helpers/settingsFunction'

const SettingsModal: React.FC = () => {
  const { setDisplaySettingsMenu } = useViews()
  const [selectedItem, setSelectedItem] = React.useState<string | null>('General')
  const [values, setValues] = React.useState<Record<string, any>>({})
  const [oldValues, setOldValues] = React.useState<Record<string, any>>({})
  const [changed, setChanged] = React.useState<Record<string, any>>({})

  const settingsApi = useConveyor('settings')

  const handleChange = (id: string, val: any) => {
    setValues((prev) => {
      const updated = { ...prev, [`${selectedItem}.${id}`]: val }

      // compute diff immediately
      const diff: Record<string, any> = {}
      for (const key in updated) {
        if (updated[key] !== oldValues[key]) diff[key] = updated[key]
      }
      setChanged(diff)

      return updated
    })
  }

  const handleSave = () => {
    settingsApi.updateSettings(changed)
    setOldValues(values)
    setChanged({})
  }

  const handleLoadSettings = async () => {
    const settings = await settingsApi.readSettings()
    const flat = flattenSettings(settings)

    setValues(flat)
  }

  React.useEffect(() => {
    handleLoadSettings()
  }, [])

  // React.useEffect(() => {
  //   const readSettings = async () => {
  //     const settings = await settingsApi.readSettings()
  //     console.log(settings)
  //   }

  //   readSettings()
  // }, [changed])

  const current = selectedItem ? SETTINGS_CONFIG[selectedItem] : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-primary rounded-lg shadow-lg border-[#a9885c] border-2 h-4/5 w-[95vw] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center border-[#a9885c] py-2 px-4 border-b-2">
          <LucideCog size={30} />
          <h2 className="font-bold text-2xl ml-2">Settings</h2>
          <button className="ml-auto text-4xl hover:text-red-800" onClick={() => setDisplaySettingsMenu(false)}>
            ⨯
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-1/4 border-r-2 border-[#a9885c] p-4 flex flex-col space-y-2 overflow-y-auto">
            {Object.keys(SETTINGS_CONFIG).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedItem(key)}
                className={`flex text-left text-2xl font-bold px-3 py-2 rounded hover:bg-[#a9885c]/60 ${
                  selectedItem === key ? 'bg-[#a9885c]/80' : ''
                }`}
              >
                <span className="mr-2 mt-[4px]">
                  {' '}
                  {React.createElement(SETTINGS_CONFIG[key].icon, { className: 'w-6 h-6' })}
                </span>
                {key}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 p-6 overflow-y-auto">
              {current ? (
                <>
                  <h2 className="text-3xl font-bold mb-4">{selectedItem} Settings</h2>
                  {current.fields.map((f) => (
                    <SettingField
                      key={f.id}
                      field={f}
                      value={values[`${selectedItem}.${f.id}`]}
                      onChange={handleChange}
                    />
                  ))}
                </>
              ) : (
                <p className="text-xl">Select a category from the sidebar</p>
              )}
            </div>

            {/* Bottom bar */}
            <div className="border-t-2 border-[#a9885c] bg-primary backdrop-blur-sm py-3 px-6 flex justify-end sticky bottom-0">
              <button
                className={`bg-[#a9885c] hover:bg-[#b89d70] text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors ${
                  Object.keys(changed).length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={Object.keys(changed).length === 0}
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
