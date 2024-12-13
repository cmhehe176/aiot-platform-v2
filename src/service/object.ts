import api from './api'
import { MessageService } from './base.message'

export const objectService = new MessageService(api, 'object')
