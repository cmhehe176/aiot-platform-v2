<script lang="ts" setup>
  import ObjectMessage from '@/component/Alert/ObjectMessage.vue'
  import FilterProject from '@/component/FilterProject.vue'
  import { objectService } from '@/service/object'
  import { onMounted, ref } from 'vue'
  import NotificationMessage from '@/component/Alert/NotificationMessage.vue'
  import SensorMessage from '@/component/Alert/SensorMessage.vue'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { useSocket } from '@/composables/useSocket'

  const { connectSocket } = useSocket()
  const { isAdmin } = storeToRefs(useAuthStore())

  connectSocket()

  const tabValue = ref('notification')
  const dataObjects = ref()
  const total = ref()

  const handleFetchApi = async () => {
    const res = await objectService.getMessage()

    if (!res) return

    dataObjects.value = res.data
    total.value = res.total
  }

  onMounted(async () => {
    await handleFetchApi()
  })
</script>

<template>
  <FilterProject
    class="filter-alert"
    :filter="{ project: true, device: true, datePicker: true, typeObject: true, tabs: true }"
    v-model:tabs="tabValue"
  />
  <div v-if="tabValue === 'object' && isAdmin" class="overflow-y-auto">
    <ObjectMessage v-for="data in dataObjects" :key="data.id" :alert="data" />
  </div>

  <div v-if="tabValue === 'sensor' && isAdmin">
    <SensorMessage v-for="data in dataObjects" :key="data.id" :alert="data" />
  </div>

  <div v-else>
    <NotificationMessage v-for="data in dataObjects" :key="data.id" :alert="data" />
  </div>
</template>

<style lang="scss" scoped>
  .filter-alert {
  }
</style>
