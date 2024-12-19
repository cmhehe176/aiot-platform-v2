import type { AxiosInstance } from 'axios'
import api from './api'
import type { DashboardResponse } from './type'

class DashboardService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async getDashboard(params?: {
    projectId?: number
    startDate?: string | Date
    endDate?: string | Date
  }): Promise<DashboardResponse> {
    try {
      const response = await this.axiosInstance.get(`/dashboard`, { params })
      if (response.data) return response.data
    } catch (error) {
      console.error(error)
    }
  }

  async getDetailSensor(
    deviceId: number,
    params?: {
      startDate?: string | Date
      endDate?: string | Date
    },
  ): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/dashboard/detail?deviceId=${deviceId}`, {
        params,
      })
      if (response.data) return response.data
    } catch (error) {
      console.error(error)
    }
  }
}

export const dashboardService = new DashboardService(api)
