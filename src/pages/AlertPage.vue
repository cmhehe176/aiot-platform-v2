<script lang="ts" setup>
  import ObjectMessage from '@/component/Alert/ObjectMessage.vue'
  import FilterProject from '@/component/FilterProject.vue'
  import { objectService } from '@/service/object'
  import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import NotificationMessage from '@/component/Alert/NotificationMessage.vue'
  import SensorMessage from '@/component/Alert/SensorMessage.vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useSocket } from '@/composables/useSocket'
  import { notificationService } from '@/service/notification'
  import { ElNotification } from 'element-plus'
  import { sensorService } from '@/service/sensor'
  import { isEqual } from 'lodash'
  import { formatDate } from '@/utils/dayjs'

  const { connectSocket, disconnectSocket, onSocket, offSocket } = useSocket()
  const { isAdmin } = storeToRefs(useAuthStore())

  const tabValue = ref('notification')
  const valueDatePicker = ref()

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
      title: status === 1 ? 'Accept' : 'Reject',
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

    ElNotification({
      title: 'Notification',
      message: 'Success',
      type: 'success',
      duration: 1000,
    })

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

  onMounted(async () => {
    await Promise.all([
      fetchApiNotifications(),
      isAdmin.value ? fetchApiObjects() : '',
      isAdmin.value ? fetchApiSensors() : '',
    ])

    connectSocket()

    onSocket('notificationMessage', (data) => {
      dataNotifications.data = [data, ...dataNotifications.data]

      ElNotification({
        title: 'Notification',
        message: 'You have Message for Notification',
        type: 'success',
        duration: 1000,
      })
    })

    onSocket('sensorMessage', (data) => {
      dataSensors.data = [data, ...dataSensors.data]

      ElNotification({
        title: 'Object',
        message: 'You have Message for Object Detect',
        type: 'success',
        duration: 1000,
      })
    })

    onSocket('objectMessage', (data) => {
      dataObjects.data = [data, ...dataObjects.data]

      ElNotification({
        title: 'Sensor',
        message: 'You have Message for Sensor',
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
      />
    </div>

    <div v-if="tabValue === 'notification'">
      <NotificationMessage
        v-for="data in dataNotifications.data"
        :key="data.id"
        :alert="data"
        @accept="handleMessage"
        @reject="handleMessage"
      />
    </div>
  </div>

  <Paginator
    class="fixed w-full bottom-0 right-1 p-4"
    v-model="params.page"
    :totalRecords="total"
    :page="params.page"
    :rows="params.limit"
    :rowsPerPageOptions="[5, 10, 25, 40, 50]"
    @page="handlePageChange"
  >
  </Paginator>
</template>

<style lang="scss" scoped>
  .filter-alert {
  }
</style>
