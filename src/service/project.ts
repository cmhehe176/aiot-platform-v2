import type { AxiosInstance } from 'axios'
import api from './api'

class ProjectService {
  private axiosInstance: AxiosInstance

  constructor(axios: AxiosInstance) {
    this.axiosInstance = axios
  }
}

export const projectService = new ProjectService(api)
