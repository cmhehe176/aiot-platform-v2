import api from './api'
import { MessageService } from './base.message'

export const notificationService = new MessageService(api, 'notification')
