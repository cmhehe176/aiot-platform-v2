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

  getlistDeviceFree = async () => {
    try {
      const res = await this.axiosInstance.get(`/device/free`)
      if (res.data) return res.data

      return res
    } catch (error) {}
  }

  updateDevice = async (id, payload?) => {
    try {
      const res = await this.axiosInstance.put(`/device/${id}`, payload)

      if (res.data) return res.data
    } catch (error) {
      console.error(error)
    }
  }

  getListSubDevice = async (type = 'all') => {
    try {
      const res = await this.axiosInstance.get(`/device/sub-device/${type}`)

      if (res.data) return res.data
    } catch (error) {
      console.error(error)
    }
  }

  updateSubDevice = async (id, payload?) => {
    try {
      const res = await this.axiosInstance.put(`/device/sub-device/${id}`, payload)

      if (res.data) return res.data
    } catch (error) {
      console.error(error)
    }
  }

  turnOffDevice = async (id) => {
    try {
      const res = await this.axiosInstance.put(`/device/status/${id}`)

      if (res.data) return res.data
    } catch (error) {
      console.error(error)
    }
  }
}

export const deviceService = new DeviceService(api)
