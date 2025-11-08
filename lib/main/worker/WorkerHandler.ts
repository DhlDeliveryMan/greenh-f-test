import net from 'net'
import { Command, EventMessage } from './types'
import { Status } from './types'
import { ipcMain } from 'electron'

export class WorkerClient {
  private socket: net.Socket
  private socketPath: string
  private window: Electron.BrowserWindow | null = null
  private status: Status
  private warnings: any[]

  // Move these to class properties
  private reconnectTimeout: NodeJS.Timeout | null = null
  private reconnectAttempts = 0
  private readonly maxReconnectTime = 30000
  private readonly reconnectInterval = 1000

  constructor(socketPath: string, window: Electron.BrowserWindow) {
    this.socketPath = socketPath
    this.window = window
    this.socket = net.createConnection(this.socketPath)
    this.setupListeners()
    this.status = {
      worker: { status: 'disconnected' },
      rs485: { status: 'disconnected' },
    }
    this.warnings = []

    ipcMain.handle('get-worker-status', async () => {
      return this.status
    })

    ipcMain.handle('get-worker-warnings', async () => {
      return this.warnings
    })
  }

  private tryReconnect() {
    if (this.reconnectTimeout) return // Already trying
    const startTime = Date.now()
    this.reconnectAttempts = 0
    this.status.worker.status = 'connecting'

    const attempt = () => {
      if (Date.now() - startTime > this.maxReconnectTime) {
        console.error('Failed to reconnect to worker after 30 seconds.')
        this.status.worker.status = 'disconnected'
        this.broadcastStatus(this.status)
        this.reconnectTimeout = null
        return
      }
      this.reconnectAttempts++
      console.log(`Reconnect attempt ${this.reconnectAttempts}`)
      this.socket = net.createConnection(this.socketPath)
      this.setupListeners()
      this.reconnectTimeout = setTimeout(() => {
        if (this.status.worker.status !== 'connected') {
          attempt()
        } else {
          this.reconnectTimeout = null
        }
      }, this.reconnectInterval)
    }

    attempt()
  }

  private setupListeners() {
    this.socket.on('connectionAttempt', () => {
      console.log('Attempting to connect to worker...')
      this.status.worker.status = 'connecting'
      this.broadcastStatus(this.status)
    })

    this.socket.on('connect', () => {
      console.log('Connected to worker')
      this.status.worker.status = 'connected'
      this.status.worker.error = undefined
      this.broadcastStatus(this.status)
    })

    this.socket.on('error', (err) => {
      console.error('Worker socket error:', err)
      this.status.worker.error = err.message
    })

    this.socket.on('close', () => {
      console.log('Worker connection closed')

      if (this.status.worker.status !== 'connecting') this.status.worker.status = 'disconnected'

      this.broadcastStatus(this.status)
      this.closeListeners()
      this.tryReconnect() // Call the class method here
    })

    this.socket.on('data', (data) => {
      const messages: EventMessage[] = data
        .toString()
        .split('\n')
        .filter(Boolean)
        .map((raw) => {
          try {
            return JSON.parse(raw)
          } catch (e) {
            console.error('Failed to parse message:', raw)
            return null
          }
        })
        .filter((msg): msg is EventMessage => msg !== null)

      messages.forEach((msg: EventMessage) => {
        switch (msg.event) {
          case 'status_update':
            this.handleStatusUpdate(msg.data)
          case 'sensor_update':
            this.broadcastSensorData(msg.data)
            break
          case 'warning_issued':
            this.broadcastWarning(msg.data)
            break
          // Handle other event types as needed
          default:
            console.warn('Unknown event type:', msg.event)
        }
      })
    })
  }

  private closeListeners() {
    this.socket.removeAllListeners('connectionAttempt')
    this.socket.removeAllListeners('connect')
    this.socket.removeAllListeners('error')
    this.socket.removeAllListeners('close')
    this.socket.removeAllListeners('data')
  }

  public sendCommand(cmd: Command) {
    this.socket.write(JSON.stringify(cmd) + '\n')
  }

  private broadcastStatus(status: Status) {
    // console.log('Broadcasting status to renderer:', status)
    this.window?.webContents.send('worker-status', status)
  }

  private broadcastSensorData(data: any) {
    // console.log('Broadcasting sensor data to renderer:', data)
    this.window?.webContents.send('sensor-data', data)
  }

  private broadcastWarning(warning: any) {
    if (warning && typeof warning === 'object' && 'id' in warning) {
      const existingIndex = this.warnings.findIndex((item) => item?.id === warning.id)
      if (existingIndex >= 0) {
        this.warnings[existingIndex] = warning
      } else {
        this.warnings.push(warning)
      }
    } else {
      this.warnings.push(warning)
    }
    this.window?.webContents.send('worker-warning', warning)
  }

  private handleStatusUpdate(status: { status: 'connected' | 'fail' | 'disconnected'; error?: string }) {
    console.log(status)
    this.status = { ...this.status, rs485: { status: status.status, error: status.error } }
    this.broadcastStatus(this.status)
  }

  public close() {
    this.socket.end()
  }
}
