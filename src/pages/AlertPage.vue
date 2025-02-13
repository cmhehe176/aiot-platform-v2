<script lang="ts" setup>
  import ObjectMessage from '@/component/Alert/ObjectMessage.vue'
  import FilterProject from '@/component/FilterProject.vue'
  import { sensorService } from '@/service/sensor'
  import { objectService } from '@/service/object'
  import { computed, onMounted, onUnmounted, reactive, ref, toRef, watch } from 'vue'
  import NotificationMessage from '@/component/Alert/NotificationMessage.vue'
  import SensorMessage from '@/component/Alert/SensorMessage.vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useSocket } from '@/composables/useSocket'
  import { notificationService } from '@/service/notification'
  import { ElNotification } from 'element-plus'
  import { isEqual } from 'lodash'
  import DetailSensor from '@/component/Alert/DetailSensor.vue'
  import DetailNotification from '@/component/Alert/DetailNotification.vue'
  import type { MessageService } from '@/service/base.message'

  const serviceMap = {
    sensor: sensorService,
    object: objectService,
  }

  const { connectSocket, disconnectSocket, onSocket, offSocket } = useSocket()
  const { isAdmin } = storeToRefs(useAuthStore())

  const tabValue = ref('notification')
  const valueDatePicker = ref()
  const detailSensor = reactive({
    isDialog: false,
    data: undefined,
  })

  const detailNotification = reactive({
    isDialog: false,
    data: undefined,
  })

  const initParams = {
    device_id: undefined,
    page: 1,
    limit: 5,
    start: '',
    end: '',
    q: '',
    type: '',
    project_id: -1,
  }

  const params = reactive({ ...initParams })

  const dataObjects = reactive({
    data: ref([]),
    total: NaN,
  })

  const dataNotifications = reactive({
    data: [],
    total: NaN,
  })

  const dataSensors = reactive({
    data: [],
    total: NaN,
  })

  const total = computed(() => {
    if (tabValue.value === 'sensor') return dataSensors.total
    if (tabValue.value === 'object') return dataObjects.total

    return dataNotifications.total
  })

  const handlePageChange = async (page) => {
    if (params.page === page.page + 1 && params.limit === page.rows) return

    params.page = page.page + 1
    params.limit = page.rows

    await handleFetchApi(true)
  }

  const handleMessage = async (data) => {
    const { id, status } = data

    switch (tabValue.value) {
      case 'notification':
        await notificationService.replied(id, status)
        await fetchApiNotifications()

        break

      case 'object':
        await objectService.replied(id, status)
        await fetchApiObjects()

        break

      case 'sensor':
        await sensorService.replied(id, status)
        await fetchApiSensors()

        break

      default:
        return
    }

    ElNotification({
      title: status === 1 ? '✅ Accept' : '❌ Reject',
      message: 'Success',
      type: 'success',
      duration: 1000,
    })

    return
  }

  const handleFetchApi = async (next: boolean = false) => {
    if (isEqual(params, initParams) && !next) return

    switch (tabValue.value) {
      case 'notification':
        await fetchApiNotifications()
        break

      case 'object':
        await fetchApiObjects()
        break

      case 'sensor':
        await fetchApiSensors()
        break

      default:
        return
    }

    // ElNotification({
    //   title: 'Refresh Data',
    //   message: 'Success',
    //   type: 'success',
    //   duration: 1000,
    // })

    return
  }

  const fetchApiObjects = async () => {
    const { data, total } = await objectService.getMessage(params).catch(console.error)

    dataObjects.data = data
    dataObjects.total = total
  }

  const fetchApiNotifications = async () => {
    const { data, total } = await notificationService.getMessage(params).catch(console.error)

    dataNotifications.data = data
    dataNotifications.total = total
  }

  const fetchApiSensors = async () => {
    const { data, total } = await sensorService.getMessage(params).catch(console.error)

    dataSensors.data = data
    dataSensors.total = total
  }

  const handleDetailNotification = async (notifications) => {
    if (!notifications?.external_messages) return

    try {
      const messageData = await Promise.all(
        notifications.external_messages.map((noti) => {
          const service: MessageService = serviceMap[noti.type]

          return service.getDetail({
            message_id: noti.message_id,
            device_id: notifications.device_id,
          })
        }),
      )

      Object.assign(detailNotification, {
        isDialog: true,
        data: {
          ...notifications,
          message: messageData.map((message) => ({
            ...message,
            type: message.message_id.includes('obj') ? 'object' : 'sensor',
          })),
          type: notifications.external_messages.map((noti) => noti.type),
        },
      })
    } catch (error) {
      ElNotification({
        title: 'Không tìm thấy dữ liệu',
        message: 'Error',
        type: 'error',
        duration: 1000,
      })
    }
  }

  onMounted(async () => {
    await Promise.all([
      fetchApiNotifications(),
      isAdmin.value ? fetchApiObjects() : '',
      isAdmin.value ? fetchApiSensors() : '',
    ])

    connectSocket()

    onSocket('notificationMessage', (payload) => {
      const data = toRef(payload)

      dataNotifications.data = [data.value, ...dataNotifications.data]

      ElNotification({
        title: '🚀 Notification',
        message: 'You have Message for Notification',
        type: 'success',
        duration: 1000,
      })
    })

    // if (isAdmin.value) return

    onSocket('sensorMessage', (payload) => {
      const data = toRef(payload)

      dataSensors.data = [data.value, ...dataSensors.data]

      // ElNotification({
      //   title: 'Sensor',
      //   message: 'You have Message for Object Sensor',
      //   type: 'success',
      //   duration: 1000,
      // })
    })

    onSocket('objectMessage', (payload) => {
      const data = toRef(payload)

      dataObjects.data = [data.value, ...dataObjects.data]

      ElNotification({
        title: '📸 Object',
        message: 'You have Message for Object',
        type: 'success',
        duration: 1000,
      })
    })
  })

  onUnmounted(() => {
    offSocket('notificationMessage')
    offSocket('sensorMessage')
    offSocket('objectMessage')

    disconnectSocket()
  })

  watch(
    () => valueDatePicker.value,
    (newValue) => {
      if (newValue.length < 2) return

      params.start = newValue[0]
      params.end = newValue[1]

      if (params.end) handleFetchApi()
    },
  )
</script>

<template>
  <div class="alert-page">
    <FilterProject
      class="filter-alert"
      :filter="{
        project: true,
        device: true,
        datePicker: true,
        typeObject: tabValue === 'object' ? true : false,
        tabs: true,
      }"
      v-model:tabs="tabValue"
      v-model:device="params.device_id"
      v-model:project="params.project_id"
      v-model:date-picker="valueDatePicker"
      v-model:type-object="params.type"
      @device="handleFetchApi"
      @project="handleFetchApi"
      @type-object="handleFetchApi"
      @tabs="handleFetchApi"
    />

    <div class="pb-20">
      <div v-if="tabValue === 'object' && isAdmin" class="overflow-y-auto">
        <ObjectMessage
          v-for="data in dataObjects.data"
          :key="data.id"
          :alert="data"
          @accept="handleMessage"
          @reject="handleMessage"
        />
      </div>

      <div v-if="tabValue === 'sensor' && isAdmin">
        <SensorMessage
          v-for="data in dataSensors.data"
          :key="data.id"
          :alert="data"
          @accept="handleMessage"
          @reject="handleMessage"
          @detail="(data) => Object.assign(detailSensor, { isDialog: true, data })"
        />
      </div>

      <div v-if="tabValue === 'notification'">
        <NotificationMessage
          v-for="data in dataNotifications.data"
          :key="data.id"
          :alert="data"
          @accept="handleMessage"
          @reject="handleMessage"
          @detail="handleDetailNotification"
        />
      </div>
    </div>

    <Paginator
      class="fixed w-full bottom-0 right-1 p-4"
      v-model="params.page"
      :totalRecords="total"
      :page="params.page"
      :rows="params.limit"
      :rowsPerPageOptions="[5, 10, 25, 40, 50, 100]"
      @page="handlePageChange"
    />

    <DetailSensor
      v-if="detailSensor.data"
      v-model="detailSensor.isDialog"
      :sensor-data="detailSensor.data"
    />

    <DetailNotification
      v-if="detailNotification.data"
      v-model="detailNotification.isDialog"
      :notification-data="detailNotification.data"
      :type="detailNotification.data.type"
    />
  </div>
</template>

<style lang="scss" scoped></style>
