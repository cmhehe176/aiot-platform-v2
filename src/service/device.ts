import type { AxiosInstance } from 'axios'
import api from './api'

class DeviceService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  getListDevice = async () => {
    try {
      const res = await this.axiosInstance.get(`/device`)

      if (res.data) return res.data
    } catch (error) {
      console.error(error)
    }
  }

  updateDevice = async (id, payload?) => {
    try {
      const res = await this.axiosInstance.put(`/device/${id}`, payload)

      if (res.data) return res.data
    } catch (error) {
      console.error(error)
    }
  }
}

export const deviceService = new DeviceService(api)
