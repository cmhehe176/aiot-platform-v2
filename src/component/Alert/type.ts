export type ObjectMessage = {
  id: number
  device_id: number
  message_id: string
  timestamp: string
  location: {
    id: string
    alt: number
    lat: number
    lon: number
    description: string
  }
  createdAt: string
  specs: {
    camera: {
      id: string
      type: string
    }
    description: string
  }
  object_list: {
    id: string
    bbox: {
      topleftx: number
      toplefty: number
      bottomrightx: number
      bottomrighty: number
    }
    object:
      | { age: string; type: 'human'; gender: string }
      | { type: 'vehicle'; brand: string; color: string; licence: string; category: string }
    image_URL: string
    type?: string
    action?: string
    object_id?: string
    video_URL?: string
  }[]
  device: {
    id: number
    createdAt: string
    updatedAt: string
    projectId: number
    data: any
    isActive: boolean
    name: string
    mac_address: string
    deviceId: string
  }
}

export type DataObjectMessage = {
  data: ObjectMessage[]
  total: number
}

export type DataNotificationMessage = {
  data: {
    id: number
    device_id: number
    message_id: string
    timestamp: string
    location: {
      id: string
      alt: number
      lat: number
      lon: number
      description: string
    }
    createdAt: string
    CAT: string
    payload: string
    external_messages: {
      type: string
      message_id: string
    }[]
    device: {
      id: number
      createdAt: string
      updatedAt: string
      projectId: number
      data: any
      isActive: boolean
      name: string
      mac_address: string
      deviceId: string
    }
  }[]

  total: number
}

export type DataSensorMessage = {
  data: {
    message_id: string
    timestamp: string | Date
    location: {
      id: string
      lat: number
      lon: number
      alt: number
      description: string
    }
    sensor_list: {
      id: string
      name: string
      description: string
      unit: string
      payload: number | number[] | number[][]
    }[]
  }[]

  total: number
}
