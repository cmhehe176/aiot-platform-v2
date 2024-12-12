import type { AxiosInstance } from 'axios'
import api from './api'

class UserService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async getAllUser() {
    try {
      const response = await this.axiosInstance.get('/user')
      if (response.data) return response.data

      return response
    } catch (error) {}
  }

  async getUserByProject(id: number) {
    try {
      const res = await this.axiosInstance.get(`/project/${id}`)

      if (res.data) return res.data
      return res
    } catch (error) {}
  }
}

export const userService = new UserService(api)
