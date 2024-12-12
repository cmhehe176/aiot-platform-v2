import type { AxiosInstance } from 'axios'
import api from './api'

class UserService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }

  async getAllUser() {
    try {
      const response = await this.axiosInstance.get('/user/role/2')
      if (response.data) return response.data

      return response
    } catch (error) {}
  }
}

export const userService = new UserService(api)