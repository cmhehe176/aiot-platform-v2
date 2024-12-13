import { WebSocket } from '@/service/socket.ts'

declare module 'vue' {
  interface ComponentCustomProperties {
    $socket: WebSocket
  }
}

export type Event =
  | 'connect'
  | 'error'
  | 'events'
  | 'disconnect'
  | 'connect_error'
  | 'reconnect'
  | 'reconnect_attempt'
  | 'reconnect_error'
  | 'reconnect_failed'
  | 'ping'
