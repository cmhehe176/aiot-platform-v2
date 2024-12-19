<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import { onMounted, ref, watch } from 'vue'
  import FilterProject from '@/component/FilterProject.vue'
  import MessageChart from '@/component/Chart/MessageDevice.vue'
  import { dashboardService } from '@/service/dashboard'
  import { storeToRefs } from 'pinia'
  import StatusDevice from '@/component/Chart/StatusDevice.vue'
  import ObjectType from '@/component/Chart/ObjectType.vue'
  import NotificationType from '@/component/Chart/NotificationType.vue'
  import type { DashboardResponse } from '@/service/type'
  import StatusNotification from '@/component/Chart/StatusNotification.vue'
  import SensorChart from '@/component/Chart/SensorChart.vue'

  const { isAdmin } = storeToRefs(useAuthStore())

  const dataChart = ref<DashboardResponse>()
  const modelProject = ref()
  const modelDatePicker = ref()
  const modelDetailSensor = ref(1)
  const modelDevice = ref()
  const dataDetailSensor = ref([])

  const handleFetchDashboard = async (projectId?: number, datePicker?: any[]) => {
    const res = await dashboardService.getDashboard({
      projectId: projectId === -1 ? undefined : projectId,
      startDate: datePicker ? datePicker[0] : undefined,
      endDate: datePicker ? datePicker[1] : undefined,
    })

    if (!res) return

    dataChart.value = res
  }

  const handleFetchDetailSensor = async (deviceId: number, datePicker?: any[]) => {
    const res = await dashboardService.getDetailSensor(deviceId, {
      startDate: datePicker ? datePicker[0] : undefined,
      endDate: datePicker ? datePicker[1] : undefined,
    })

    if (!res) return

    dataDetailSensor.value = res
  }

  onMounted(async () => await handleFetchDashboard(modelProject.value))
</script>

<template>
  <div>
    <FilterProject
      class="p-1 w-full"
      v-model:project="modelProject"
      v-model:date-picker="modelDatePicker"
      v-model:type-chart="modelDetailSensor"
      v-model:device="modelDevice"
      :filter="{
        project: true,
        datePicker: true,
        typeChart: true,
        device: modelDetailSensor === 2 ? true : false,
      }"
      @project="handleFetchDashboard(modelProject, modelDatePicker)"
      @date-picker="
        modelDetailSensor === 1
          ? handleFetchDashboard(modelProject, modelDatePicker)
          : handleFetchDetailSensor(modelDevice, modelDatePicker)
      "
      @device="handleFetchDetailSensor(modelDevice, modelDatePicker)"
    />

    <div v-if="modelDetailSensor === 1" class="flex gap-24 flex-wrap my-10">
      <StatusNotification
        v-if="dataChart?.notificationStatus && isAdmin"
        :status-notification="dataChart.notificationStatus.objects"
        type="Objects"
      />

      <StatusNotification
        v-if="dataChart?.notificationStatus"
        :status-notification="dataChart.notificationStatus.notifications"
        type="Notification"
      />

      <StatusNotification
        v-if="dataChart?.notificationStatus && isAdmin"
        :status-notification="dataChart.notificationStatus.sensors"
        type="Sensor"
      />

      <StatusDevice v-if="dataChart?.statusDevice" :status-device="dataChart?.statusDevice" />

      <MessageChart
        class="w-4/6"
        v-if="dataChart?.messageDevice"
        :message-device="dataChart?.messageDevice"
      />

      <ObjectType v-if="dataChart?.typeDetect" :object-type="dataChart?.typeDetect" />

      <NotificationType
        v-if="dataChart?.notificationType"
        :notification-type="dataChart?.notificationType"
      />
    </div>

    <div
      v-if="modelDetailSensor === 2 && dataDetailSensor.length"
      class="flex gap-24 flex-wrap my-10"
    >
      <SensorChart v-for="data in dataDetailSensor" :key="data.name" :sensor-data="data" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
