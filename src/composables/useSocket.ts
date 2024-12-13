import { WebSocket } from '@/service/socket'
import { getCurrentInstance } from 'vue'

import type { Event } from '@/type/socket'

type Callback = (data: any) => void

export const useSocket = () => {
  const internalInstance = getCurrentInstance()
  const socket = internalInstance?.appContext.config.globalProperties.$socket as WebSocket

  const emitSocket = (event: Event | string, data: any) => {
    socket.emit(event, data)
  }

  const onSocket = (event: Event | string, callback: Callback) => {
    socket.on(event, callback)
  }

  const offSocket = (event: Event | string, callback?: Callback) => {
    socket.off(event, callback)
  }

  const connectSocket = () => {
    socket.connect()
  }

  const disconnectSocket = () => {
    socket.disconnect()
  }

  return { emitSocket, onSocket, offSocket, connectSocket, disconnectSocket }
}
