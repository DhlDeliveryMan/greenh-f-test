import { BrowserWindow, shell, app, screen } from 'electron'
import { join } from 'path'
import appIcon from '@/resources/build/icon.png?asset'
import { registerResourcesProtocol } from './protocols'
import { registerWindowHandlers } from '@/lib/conveyor/handlers/window-handler'
import { registerAppHandlers } from '@/lib/conveyor/handlers/app-handler'
// import { createInitialSettings } from './settings'
import { registerSettingsHandlers } from '../conveyor/handlers/settings-handler'
import { WorkerClient } from './worker/WorkerHandler'

export const SOCKET = '/tmp/greenhouse.sock'

export function createAppWindow(): void {
  // Register custom protocol for resources
  registerResourcesProtocol()

  // createInitialSettings()

  const displays = screen.getAllDisplays()
  console.log('Available Displays:', displays)

  const targetDisplay = displays.find((d) => d.bounds.width === 1024 && d.bounds.height === 600)

  const { x, y } = targetDisplay ? targetDisplay.bounds : { x: 0, y: 0 }
  // const { x, y } = displays[0].bounds

  // Create the main window.
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 601,
    x: x,
    y: y,
    show: false,
    backgroundColor: '#1c1c1c',
    icon: appIcon,
    frame: false,
    titleBarStyle: 'hiddenInset',
    title: 'Electron React App',
    maximizable: false,
    resizable: false,
    kiosk: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.js'),
      sandbox: false,
    },
  })

  // Register IPC events for the main window.
  registerSettingsHandlers(app)
  registerWindowHandlers(mainWindow)
  registerAppHandlers(app)

  const worker = new WorkerClient(SOCKET, mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}
