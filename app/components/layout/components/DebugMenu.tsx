import React from 'react'
import { Status, STATUS_LIST, useDataContext } from '../../hooks/DataContext'
import { findView, useViews, VIEWS } from '../../hooks/ViewsContext'
import { useAnnouncements } from '../../hooks/AnnouncementsContext'
import { LucideTriangleAlert, LucideUserMinus } from 'lucide-react'
import { useWarnings } from '../../hooks/WarningsContext'

const DebugMenu: React.FC = () => {
  const { statusCodes, setStatusCodes } = useDataContext()
  const { displayedTopMenu, setDisplayedTopMenu, setMainView } = useViews()
  const { addAnnouncement } = useAnnouncements()
  const { addWarning, clearWarnings, removeWarning } = useWarnings()

  const addStatus = (status: Status) => {
    setStatusCodes((prev) => [...prev, status])
  }

  const removeStatus = (status: Status) => {
    setStatusCodes((prev) => prev.filter((s) => s !== status))
  }

  function addRandomAnnouncements(count: number) {
    const messages = [
      'System check complete.',
      'New sensor connected.',
      'Warning: High humidity detected.',
      'Maintenance required soon.',
      'All systems operational.',
      'Debug: Test announcement.',
    ]

    for (let i = 0; i < count; i++) {
      const randomMessage = messages[Math.floor(Math.random() * messages.length)]
      addAnnouncement({
        message: randomMessage,
        type: 'success',
        title: 'Success',
        icon: <LucideTriangleAlert size={30} />,
        displayInTopBar: true,
        duration: 5000,
        id: Date.now() + Math.random(),
        timestamp: Date.now(),
      })
    }
  }

  return (
    <div className="fixed top-20 right-6 z-40 bg-primary rounded-xl shadow-2xl p-6 w-200 border border-green-200 overflow-y-scroll">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-green-800">Debug Menu</h2>
        {/* Add a close button if needed */}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-green-700 mb-2">Statuses</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(STATUS_LIST).map((status) => {
            const isActive = statusCodes.includes(status as Status)

            return (
              <button
                key={status}
                onClick={() => (isActive ? removeStatus(status as Status) : addStatus(status as Status))}
                className={`px-3 py-1 rounded transition
        ${
          isActive
            ? 'bg-green-700 hover:bg-green-600 text-white'
            : 'bg-amber-900 hover:bg-gray-300 text-white hover:text-black'
        }
      `}
              >
                {status}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mb-4 border-t border-green-300 pt-4">
        <h3 className="font-semibold text-green-700 mb-2">Warnings</h3>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() =>
                addWarning({
                  id: Date.now() + Math.random(),
                  message: 'High temperature detected.',
                  title: 'High Temp',
                  severity: 'high',
                  timestamp: Date.now(),
                  icon: <LucideTriangleAlert size={18} />,
                } as any)
              }
              className="px-3 py-1 bg-amber-900 rounded hover:bg-gray-300 text-white hover:text-black transition"
            >
              Add high-temp warning
            </button>

            <button
              onClick={() =>
                addWarning({
                  id: Date.now() + Math.random(),
                  message: 'Sensor disconnected.',
                  title: 'Sensor',
                  severity: 'medium',
                  timestamp: Date.now(),
                  icon: <LucideTriangleAlert size={18} />,
                } as any)
              }
              className="px-3 py-1 bg-amber-900 rounded hover:bg-gray-300 text-white hover:text-black transition"
            >
              Add sensor warning
            </button>

            <button
              onClick={() =>
                addWarning({
                  id: Date.now() + Math.random(),
                  message: 'Minor drift detected.',
                  title: 'Drift',
                  severity: 'low',
                  timestamp: Date.now(),
                  icon: <LucideTriangleAlert size={18} />,
                } as any)
              }
              className="px-3 py-1 bg-amber-900 rounded hover:bg-gray-300 text-white hover:text-black transition"
            >
              Add minor warning
            </button>

            <button
              onClick={() => {
                const id = window.prompt('Enter warning id to remove (as created when added):')
                if (!id) return
                // try numeric first, fallback to string
                removeWarning(id)
              }}
              className="px-3 py-1 bg-red-600 rounded hover:bg-gray-300 text-white hover:text-black transition flex items-center gap-2"
            >
              <LucideUserMinus size={16} /> Remove warning by id
            </button>

            <button
              onClick={() => clearWarnings()}
              className="px-3 py-1 bg-red-700 rounded hover:bg-gray-300 text-white hover:text-black transition"
            >
              Clear all warnings
            </button>
          </div>

          <p className="text-xs text-green-700/80">
            Tip: each added warning includes an id (timestamp + random) — use developer tools or the Remove-by-id prompt
            to target a specific warning.
          </p>
        </div>
      </div>

      <div className="mb-4 border-t border-green-300 pt-4">
        <h3 className="font-semibold text-green-700 mb-2">Toggles</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              addRandomAnnouncements(1)
            }}
            className="px-3 py-1 bg-amber-900 rounded hover:bg-gray-300 text-white hover:text-black transition"
          >
            Add announcement
          </button>
        </div>
      </div>

      <div className="border-t border-green-300 pt-4">
        <h3 className="font-semibold text-green-700 mb-2">Actions</h3>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex w-full gap-2">
            <button
              onClick={() => setDisplayedTopMenu(displayedTopMenu === 'cooling' ? 'status' : 'cooling')}
              className="px-3 py-1 w-full bg-amber-900 rounded hover:bg-gray-300 text-white hover:text-black transition"
            >
              Cooling view
            </button>
            <button
              onClick={() => setMainView(findView('Water Flow Diagram', 'main')!)}
              className="px-3 py-1 w-full bg-amber-900 rounded hover:bg-gray-300 text-white hover:text-black transition"
            >
              Water flow view
            </button>
            <button
              onClick={() => setMainView(findView('System Parameters', 'main')!)}
              className="px-3 py-1 w-full bg-amber-900 rounded hover:bg-gray-300 text-white hover:text-black transition"
            >
              Main view
            </button>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1 bg-red-700 rounded hover:bg-gray-300 text-white hover:text-black transition"
          >
            Reload App
          </button>
        </div>
      </div>
    </div>
  )
}

export default DebugMenu
