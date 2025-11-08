import React, { createContext, useContext, useState, ReactNode, JSX } from 'react'
import SystemParameters from '../layout/components/SystemParameters'
import WaterComponent from '../layout/components/WaterComponent'
import AirParameters from '../layout/components/AirParameters'
import WaterChain from '../layout/components/WaterChain'

interface IView {
  name: string
  view: JSX.Element
  location: location
  default: boolean
}

type location = 'main' | 'side' | 'bottom'

export const VIEWS: IView[] = [
  { name: 'System Parameters', view: <SystemParameters />, location: 'main', default: true },
  { name: 'Air Parameters', view: <AirParameters />, location: 'side', default: true },
  { name: 'Water Parameters', view: <WaterComponent />, location: 'bottom', default: true },
  { name: 'Water Flow Diagram', view: <WaterChain />, location: 'main', default: false },
]

type ViewsContextType = {
  views: IView[]
  mainView: IView
  sideView: IView
  bottomView: IView
  setMainView: (view: IView) => void
  setSideView: (view: IView) => void
  setBottomView: (view: IView) => void

  displayedTopMenu?: 'cooling' | 'status'
  setDisplayedTopMenu: (menu: 'cooling' | 'status') => void

  displaySettingsMenu: boolean
  setDisplaySettingsMenu: (display: boolean) => void
}

const ViewsContext = createContext<ViewsContextType | undefined>(undefined)

export const findView = (name: string, location: location) => {
  return VIEWS.find((view) => view.name === name)
}

export const ViewsProvider = ({ children }: { children: ReactNode }) => {
  const [currentView, setCurrentView] = useState<string>('default')

  const [mainView, setMainView] =
    useState<IView>(VIEWS.find((view) => view.location === 'main' && view.default)!) || VIEWS[0]
  const [sideView, setSideView] =
    useState<IView>(VIEWS.find((view) => view.location === 'side' && view.default)!) || VIEWS[1]
  const [bottomView, setBottomView] =
    useState<IView>(VIEWS.find((view) => view.location === 'bottom' && view.default)!) || VIEWS[2]

  const [displayedTopMenu, setDisplayedTopMenu] = useState<'cooling' | 'status'>('status')
  const [displaySettingsMenu, setDisplaySettingsMenu] = useState<boolean>(false)

  return (
    <ViewsContext.Provider
      value={{
        views: VIEWS,
        mainView,
        sideView,
        bottomView,
        setMainView,
        setSideView,
        setBottomView,
        displayedTopMenu,
        setDisplayedTopMenu,
        displaySettingsMenu,
        setDisplaySettingsMenu,
      }}
    >
      {children}
    </ViewsContext.Provider>
  )
}

export const useViews = () => {
  const context = useContext(ViewsContext)
  if (!context) {
    throw new Error('useViews must be used within a ViewsProvider')
  }
  return context
}
