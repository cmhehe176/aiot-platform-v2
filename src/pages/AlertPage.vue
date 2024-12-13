<script lang="ts" setup>
  import ObjectMessage from '@/component/Alert/ObjectMessage.vue'
  import FilterProject from '@/component/FilterProject.vue'
  import { objectService } from '@/service/object'
  import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
  import NotificationMessage from '@/component/Alert/NotificationMessage.vue'
  import SensorMessage from '@/component/Alert/SensorMessage.vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useSocket } from '@/composables/useSocket'
  import { notificationService } from '@/service/notification'

  const { connectSocket, disconnectSocket, onSocket } = useSocket()
  const { isAdmin } = storeToRefs(useAuthStore())

  const tabValue = ref('notification')
  const valueDatePicker = ref()

  const params = reactive({
    device_id: ref<number>(),
    page: ref<number>(1),
    limit: ref<number>(10),
    start: ref<string>(),
    end: ref<string>(),
    q: ref<string>(),
    type: ref<string>(''),
    project_id: ref<number>(),
  })

  const dataObjects = reactive({
    data: [],
    total: NaN,
  })

  const dataNotifications = reactive({
    data: [],
    total: NaN,
  })

  const handleFetchApiObjects = async () => {
    const { data, total } = await objectService.getMessage(params).catch(console.error)

    dataObjects.data = data
    dataObjects.total = total
  }

  const handleFetchApiNotifications = async () => {
    const { data, total } = await notificationService.getMessage(params).catch(console.error)

    dataNotifications.data = data
    dataNotifications.total = total
  }

  onMounted(async () => {
    await handleFetchApiNotifications()
    //temp
    await handleFetchApiObjects()

    connectSocket()
    onSocket('notificationMessage', (data) => {
      dataNotifications.data = [data, ...dataNotifications.data]
    })
  })

  onUnmounted(() => {
    disconnectSocket()
  })
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
  />

  <div v-if="tabValue === 'object' && isAdmin" class="overflow-y-auto">
    <ObjectMessage v-for="data in dataObjects.data" :key="data.id" :alert="data" />
  </div>

  <div v-if="tabValue === 'sensor' && isAdmin">
    <SensorMessage v-for="data in dataObjects.data" :key="data.id" :alert="data" />
  </div>

  <div v-if="tabValue === 'notification'">
    <NotificationMessage v-for="data in dataNotifications.data" :key="data.id" :alert="data" />
  </div>
</template>

<style lang="scss" scoped>
  .filter-alert {
  }
</style>
