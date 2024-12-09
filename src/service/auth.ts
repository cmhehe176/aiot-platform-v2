import type { AxiosInstance } from 'axios'
import api from './api'

class AuthService {
  private axiosIstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosIstance = axios
  }

  async login(body: { username: string; password: string }) {
    try {
      const response = await this.axiosIstance.post('/auth/login', body)

      if (!response.data.accessToken) return

      localStorage.setItem('accessToken', response.data.accessToken)

      return response.data.accessToken
    } catch (error) {
      console.log(error)
    }
  }

  async getProfile() {
    try {
      const response = await this.axiosIstance.get('/auth')

      if (response.data) {
        return response.data
      }

      return response
    } catch (error) {
      console.error(error)
    }
  }
}

export const authService = new AuthService(api)
