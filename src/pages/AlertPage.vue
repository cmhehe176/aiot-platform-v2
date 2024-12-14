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

  const { connectSocket, disconnectSocket, onSocket, offSocket } = useSocket()
  const { isAdmin } = storeToRefs(useAuthStore())

  const tabValue = ref('notification')
  const valueDatePicker = ref()

  const initParams = {
    device_id: undefined,
    page: 1,
    limit: 10,
    start: '',
    end: '',
    q: '',
    type: '',
    project_id: -1,
  }

  const params = reactive({ ...initParams })

  const dataObjects = reactive({
    data: [],
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

  const handleFetchApi = async () => {
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
        break
    }

    ElNotification({
      title: 'Notification',
      message: 'Success',
      type: 'success',
      duration: 1000,
    })
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
      if (newValue[0]) params.start = newValue[0]
      if (newValue[1]) params.end = newValue[1]
    },
  )
</script>

<template>
  <FilterProject
    class="filter-alert"
    :filter="{ project: true, device: true, datePicker: true, typeObject: true, tabs: true }"
    v-model:tabs="tabValue"
    v-model:device="params.device_id"
    v-model:project="params.project_id"
    v-model:date-picker="valueDatePicker"
    v-model:type-object="params.type"
    @device="handleFetchApi"
    @date-picker="handleFetchApi"
    @project="handleFetchApi"
    @type-object="handleFetchApi"
  />

  <div class="pb-20">
    <div v-if="tabValue === 'object' && isAdmin" class="overflow-y-auto">
      <ObjectMessage v-for="data in dataObjects.data" :key="data.id" :alert="data" />
    </div>

    <div v-if="tabValue === 'sensor' && isAdmin">
      <SensorMessage v-for="data in dataSensors.data" :key="data.id" :alert="data" />
    </div>

    <div v-if="tabValue === 'notification'">
      <NotificationMessage v-for="data in dataNotifications.data" :key="data.id" :alert="data" />
    </div>
  </div>

  <Paginator
    class="fixed bottom-0 right-1/3"
    :rows="10"
    :totalRecords="total"
    :rowsPerPageOptions="[10, 20, 30]"
  >
    <template #start="{ state }"> Page: {{ state.page }} Rows: {{ state.rows }} </template>
  </Paginator>
</template>

<style lang="scss" scoped>
  .filter-alert {
  }
</style>
