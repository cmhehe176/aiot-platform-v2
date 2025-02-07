import type { AxiosInstance } from 'axios'
import type { getMessageParams } from './type'

export class MessageService {
  private axiosInstance: AxiosInstance
  private name: string

  constructor(axios: AxiosInstance, name: string) {
    this.axiosInstance = axios
    this.name = name
  }

  async getMessage(params?: getMessageParams) {
    try {
      const response = await this.axiosInstance.get(`/${this.name}`, { params })

      if (response.data) return response.data

      return response
    } catch (error) {
      console.log(error)
    }
  }

  async getDetail(payload: any) {
    console.log(' noti.message_id', payload)
    try {
      const response = await this.axiosInstance.get(`/${this.name}/detail`, {
        params: { message_id: payload },
      })

      if (response.data) return response.data

      return response
    } catch (error) {
      console.log(error)
    }
  }

  async replied(id: number, replied: number) {
    try {
      const res = await this.axiosInstance.put(`/${this.name}/reply/${id}`, { replied })
      if (res) return res.data

      return res
    } catch (error) {
      console.error(error)
    }
  }
}
