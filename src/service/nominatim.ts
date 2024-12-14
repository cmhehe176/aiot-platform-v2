import type { AxiosInstance } from 'axios'
import api from './api'

class NominatimService {
  private axiosInstance: AxiosInstance
  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async fetchApiAddress(lat: number, lon: number) {
    try {
      const response = await this.axiosInstance.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
      )

      if (response.data) return response.data

      return response
    } catch (error) {
      console.error(error)
    }
  }
}

export const nominatimService = new NominatimService(api)
