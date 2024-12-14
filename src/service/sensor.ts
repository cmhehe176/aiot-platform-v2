import api from './api'
import { MessageService } from './base.message'

export const sensorService = new MessageService(api, 'sensor')
