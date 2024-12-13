import type { App, Plugin } from 'vue'
import { WebSocket } from '@/service/socket'

const socketPlugin: Plugin = {
  install: (app: App, socketEndpoint: string) => {
    app.config.globalProperties.$socket = new WebSocket(socketEndpoint)
  },
}

export default socketPlugin
