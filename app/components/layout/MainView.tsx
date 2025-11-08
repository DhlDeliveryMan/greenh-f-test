import React, { ReactNode } from 'react'
import logo from '../../assets/white.svg'
import { useViews } from '../hooks/ViewsContext'
import SettingsModal from './components/SettingsModal'
import AnnouncementModal from './components/AnnouncementModal'
import { useDebug } from '../hooks/DebugContext'
import DebugMenu from './components/DebugMenu'
import { useDispatch } from '../hooks/DispatchContext'
import { LucideTriangleAlert } from 'lucide-react'
import { AlertIndicator } from './components/shared/AlertIndicator'
import { useWarnings } from '../hooks/WarningsContext'

type MainViewProps = {
  children?: ReactNode
}

const MainView: React.FC<MainViewProps> = ({ children }) => {
  const { mainView, sideView, bottomView, displaySettingsMenu, setDisplaySettingsMenu } = useViews()

  const { showDebugMenu, setShowDebugMenu } = useDebug()
  const { connectionStatus } = useDispatch()
  const { warnings } = useWarnings()

  return (
    <main className="h-screen w-full bg-primary text-white ">
      <button
        className="fixed top-96 left-80 z-50 bg-green-700 text-white rounded-full p-3 shadow-lg hover:bg-green-800 transition"
        onClick={() => setShowDebugMenu(!showDebugMenu)}
      >
        {showDebugMenu ? 'Close Menu' : 'Open Menu'}
      </button>

      {/* Floating Menu */}
      {showDebugMenu && <DebugMenu />}
      <AnnouncementModal />
      {displaySettingsMenu && <SettingsModal />}
      <div className="flex justify-between items-center w-full px-4  border-b-2 border-t-2 h-16 border-[#a9885c]">
        <div className="flex items-center justify-center">
          <img src={logo} className="h-12 w-12" />
          <div className="flex-col items-center justify-center ml-1 font-semibold text-md">
            <h2 className="leading-none text-xl">Resultium</h2>
            <h2 className="leading-none">GreenPath System</h2>
          </div>
        </div>
        <div className="flex h-full">
          <div className="flex h-full border-[#a9885c] border-l-2 w-100  ">
            <div className="border-[#a9885c] border-r-2">
              <div className="flex h-full items-center justify-center w-12">
                <LucideTriangleAlert className="w-8 h-8 border-[#a9885c] text-amber-500" />
              </div>
            </div>
            <div className=" space-x-2 mt-[13px] ml-2 h-full w-full overflow-x-scroll overflow-y-hidden whitespace-nowrap no-scrollbar">
              {warnings.map((warning, index) => (
                <AlertIndicator
                  key={index}
                  type={warning.type}
                  severity={warning.severity}
                  message={warning.message}
                  location={warning.location}
                />
              ))}
            </div>
          </div>
          <div className="border-x-2 border-[#a9885c] mr-5 h-full">
            <div className="flex space-x-3 px-4 py-2 h-full items-center mt-1">
              {/* RS-485 Status */}
              <div className="relative group flex flex-col items-center mx-2">
                <span
                  className={`inline-block w-6 h-6 rounded-full border-2 border-white transition
                    ${
                      connectionStatus.rs485.status === 'connected'
                        ? 'bg-[#007f46ff]'
                        : connectionStatus.rs485.status === 'fail'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-red-800 animate-pulse'
                    }`}
                />
                <span className="text-xs mt-1 font-medium">RS-485</span>
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-8 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10
                 max-w-96 max-h-30"
                  style={{}}
                >
                  {connectionStatus.rs485.status === 'connected'
                    ? 'RS-485 Connected'
                    : connectionStatus.rs485.status === 'fail'
                      ? `RS-485 Communication Failiure ${connectionStatus.rs485.error ? ` - ${connectionStatus.rs485.error}` : ''}`
                      : `RS-485 Disconnected ${connectionStatus.rs485.error ? ` - ${connectionStatus.rs485.error}` : ''}`}
                </div>
              </div>

              {/* Worker Status */}
              <div className="relative group flex flex-col items-center mx-2">
                <span
                  className={`inline-block w-6 h-6 rounded-full border-2 border-white transition
                    ${
                      connectionStatus.worker.status === 'connected'
                        ? 'bg-[#007f46ff]'
                        : connectionStatus.worker.status === 'connecting'
                          ? 'bg-amber-500 animate-pulse'
                          : 'bg-red-800 animate-pulse'
                    }`}
                />
                <span className="text-xs mt-1 font-medium">Worker</span>
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-8 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none z-10
                 max-w-64 max-h-30"
                >
                  {connectionStatus.worker.status === 'connected'
                    ? 'Worker Connected'
                    : connectionStatus.worker.status === 'connecting'
                      ? `Worker Connecting ${connectionStatus.worker.error ? ` - ${connectionStatus.worker.error}` : ''}`
                      : `Worker Disconnected ${connectionStatus.worker.error ? ` - ${connectionStatus.worker.error}` : ''}`}
                </div>
              </div>
            </div>
          </div>
          <button
            className="text-4xl font-bold cursor-pointer"
            onClick={() => setDisplaySettingsMenu(!displaySettingsMenu)}
            tabIndex={1}
          >
            {displaySettingsMenu ? '⨯' : '≡'}
          </button>
        </div>
      </div>

      <div className=" h-[calc(100%-4rem)] w-full">
        <div className="w-full h-[70%] grid grid-cols-10 p-3 gap-2">
          <div className="w-full col-span-7 border-[#a9885c] border-2 rounded-md">{mainView.view}</div>
          <div className="col-span-3 border-[#a9885c] border-2 rounded-md">{sideView.view}</div>
        </div>

        <div className="h-[30%] w-full px-3 pb-3 flex ">{bottomView.view}</div>
      </div>
    </main>
  )
}

export default MainView
