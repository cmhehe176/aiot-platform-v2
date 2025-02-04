import type { AxiosInstance } from 'axios'
import api from './api'

class SupportService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async getList(q?: string) {
    try {
      const response = await this.axiosInstance.get('/support', { params: { q } })
      if (response.data) return response.data

      return response
    } catch (error) {
      console.error(error)
    }
  }

  async create(payload: any) {
    try {
      const response = await this.axiosInstance.post('/support', payload)
      if (response.data) return response.data

      return response
    } catch (error) {
      console.error(error)
    }
  }

  async reply(payload: { id: number; params: any }) {
    const { id, params } = payload
    try {
      const response = await this.axiosInstance.put(`/support/${id}`, params)
      if (response.data) return response.data

      return response
    } catch (error) {
      console.error(error)
    }
  }
}

export const supportService = new SupportService(api)
