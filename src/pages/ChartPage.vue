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

  const { isAdmin } = storeToRefs(useAuthStore())

  const dataChart = ref<DashboardResponse>()
  const modelProject = ref()
  const modelDatePicker = ref()

  const handleFetchDashboard = async (projectId?: number, datePicker?: any[]) => {
    const res = await dashboardService.getDashboard({
      projectId: projectId === -1 ? undefined : projectId,
      startDate: datePicker ? datePicker[0] : undefined,
      endDate: datePicker ? datePicker[1] : undefined,
    })

    if (!res) return

    dataChart.value = res
  }

  onMounted(async () => await handleFetchDashboard(modelProject.value))
</script>

<template>
  <div>
    <FilterProject
      class="p-1 w-full"
      v-model:project="modelProject"
      v-model:date-picker="modelDatePicker"
      :filter="{ project: true, datePicker: true }"
      @project="handleFetchDashboard(modelProject, modelDatePicker)"
      @date-picker="handleFetchDashboard(modelProject, modelDatePicker)"
    />

    <div class="flex gap-24 flex-wrap mt-10">
      <MessageChart v-if="dataChart?.messageDevice" :message-device="dataChart?.messageDevice" />

      <StatusDevice v-if="dataChart?.statusDevice" :status-device="dataChart?.statusDevice" />

      <ObjectType v-if="dataChart?.typeDetect" :object-type="dataChart?.typeDetect" />

      <NotificationType
        v-if="dataChart?.notificationType"
        :notification-type="dataChart?.notificationType"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
