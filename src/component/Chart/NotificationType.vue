<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'

  type TNotificationType = {
    id: number
    projectId: number
    name: string
    object: number
    sensor: number
  }

  const { notificationType } = defineProps<{ notificationType: TNotificationType[] }>()

  const chartData = ref()
  const chartOptions = ref()

  const setChartData = (notificationType: TNotificationType[]) => {
    const documentStyle = getComputedStyle(document.documentElement)

    return {
      labels: notificationType.map((noti) => noti.name || 'inValidName'),
      datasets: [
        {
          type: 'bar',
          label: 'Object',
          backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
          data: notificationType.map((noti) => noti.object),
        },
        {
          type: 'bar',
          label: 'Sensor',
          backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
          data: notificationType.map((noti) => noti.sensor),
        },
      ],
    }
  }
  const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--p-text-color')
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
      },
    }
  }

  watch(
    () => notificationType,
    (newValue) => {
      chartData.value = setChartData(newValue)
    },
  )

  onMounted(() => {
    chartOptions.value = setChartOptions()
  })
</script>

<template>
  <div class="card"></div>

  <div class="notification-type min-w-[500px]">
    <Fieldset legend="Notification Type Of Message" :toggleable="true">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[15rem]" />
    </Fieldset>
  </div>
</template>
