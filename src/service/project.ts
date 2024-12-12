import type { AxiosInstance } from 'axios'
import api from './api'

class ProjectService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async createProject(payload: { name: string; userIds?: number[]; description: string }) {
    try {
      const response = await this.axiosInstance.post('/project', payload)

      if (response.data) return response.data

      return response
    } catch (error) {}
  }
}

export const projectService = new ProjectService(api)
