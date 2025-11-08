import WelcomeKit from '@/app/components/welcome/WelcomeKit'
import './styles/app.css'
import MainView from './components/layout/MainView'
import { DebugProvider } from './components/hooks/DebugContext'
import { DataProvider } from './components/hooks/DataContext'
import { View } from 'lucide-react'
import { ViewsProvider } from './components/hooks/ViewsContext'
import { AnnouncementsProvider } from './components/hooks/AnnouncementsContext'
import { DispatchProvider } from './components/hooks/DispatchContext'
import { WarningsProvider } from './components/hooks/WarningsContext'
import { SettingsProvider } from './components/hooks/SettingsContext'

export default function App() {
  return (
    <DispatchProvider>
      <SettingsProvider>
        <WarningsProvider>
          <DebugProvider>
            <AnnouncementsProvider>
              <DataProvider>
                <ViewsProvider>
                  <MainView />
                </ViewsProvider>
              </DataProvider>
            </AnnouncementsProvider>
          </DebugProvider>
        </WarningsProvider>
      </SettingsProvider>
    </DispatchProvider>
  )
}
