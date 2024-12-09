import api from './api'
import { MessageService } from './message'

export const objectService = new MessageService(api, 'object')
