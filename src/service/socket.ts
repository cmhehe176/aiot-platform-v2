import { type ManagerOptions, Socket, io } from 'socket.io-client'
import type { Event } from '@/type/socket.d.ts'

type Callback = (data?: any) => void

const socketOption: Partial<ManagerOptions> = {
  transports: ['websocket'],
  autoConnect: false,
}

export class WebSocket {
  private readonly socket: Socket

  constructor(endpoint: string) {
    if (!endpoint) {
      throw new Error('Socket endpoint is required')
    }

    this.socket = io(endpoint, socketOption)
  }

  connect(): void {
    if (this.socket?.active) {
      return
    }

    this.socket.connect()
  }

  disconnect(): void {
    if (!this.socket?.active) {
      return
    }

    this.socket.disconnect()
  }

  on(event: Event | string, callback: Callback) {
    this.socket.on(event, callback)
  }

  off(event: Event | string, callback: Callback) {
    this.socket.off(event, callback)
  }

  emit(event: Event | string, data: any) {
    this.socket.emit(event, data)
  }
}
