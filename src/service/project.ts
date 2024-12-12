import type { AxiosInstance } from 'axios'
import api from './api'

class ProjectService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async createProject(payload: {
    name: string
    userIds?: number[]
    description: string
    deviceIds?: number[]
  }) {
    try {
      const response = await this.axiosInstance.post('/project', payload)

      if (response.data) return response.data

      return response
    } catch (error) {
      console.log(error)
    }
  }

  async updateProject(payload: {
    id: number
    name: string
    userIds?: number[]
    description: string
    deviceIds?: number[]
  }) {
    try {
      const { id, ...rest } = payload
      const response = await this.axiosInstance.put(`/project/${id}`, rest)

      if (response.data) return response.data

      return response
    } catch (error) {
      console.log(error)
    }
  }

  async deleteProject(id: number) {
    try {
      const response = await this.axiosInstance.delete(`/project/${id}`)

      if (response.data) return response.data

      return response
    } catch (error) {
      console.log(error)
    }
  }
}

export const projectService = new ProjectService(api)
