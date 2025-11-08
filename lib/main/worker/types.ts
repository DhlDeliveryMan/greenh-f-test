export type Actuator = 'fan' | 'pump' | 'light' | 'climate'

export interface Command {
  cmd: 'set_stage' | 'manual_override' | 'enable_auto'
  stage?: number
  actuator?: Actuator
  value?: boolean | number
}

export interface EventMessage {
  event: 'sensor_update' | 'actuator_state' | 'ack' | 'status_update' | 'warning_issued'
  data: any
}

export interface Status {
  worker: { status: 'connected' | 'connecting' | 'disconnected'; error?: string }
  rs485: { status: 'connected' | 'fail' | 'disconnected'; error?: string }
}
