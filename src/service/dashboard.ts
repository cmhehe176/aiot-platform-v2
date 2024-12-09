import type { AxiosInstance } from 'axios'
import api from './api'

class DashboardService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async getDashboard(params?: {
    projectId?: number
    startDate?: string | Date
    endDate?: string | Date
  }) {
    try {
      const response = await this.axiosInstance.get(`/dashboard`, { params })
      if (response.data) return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export const dashboardService = new DashboardService(api)
