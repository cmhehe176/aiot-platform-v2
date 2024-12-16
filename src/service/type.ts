export interface getMessageParams {
  page?: number
  limit?: number
  q?: string
  start?: Date | string
  end?: Date | string
  type?: string
  device_id?: number
  project_id: number
}

export interface DashboardResponse {
  messageDevice: {
    id: number
    projectId: number
    name: string
    object: number
    sensor: number
    notification: number
  }[]
  statusDevice: {
    total: number
    deviceActive: number
    deviceInActive: number
  }
  typeDetect: {
    id: number
    projectId: number
    name: string
    human: number
    vehicle: number
    all: number
  }[]
  notificationType: {
    id: number
    projectId: number
    name: string
    object: number
    sensor: number
  }[]
  notificationStatus: {
    objects: {
      status: string
      count: number
    }[]

    notifications: {
      status: string
      count: number
    }[]
    sensors: {
      status: string
      count: number
    }[]
  }
}
