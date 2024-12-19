<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { formatDate } from '@/utils/dayjs'

  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')
  const documentStyleData = getComputedStyle(document.documentElement)

  const { sensorData } = defineProps<{ sensorData: any }>()

  const chartOptions = ref({
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  })

  const chartData = computed(() => ({
    labels: sensorData.payload.map((sensor) => formatDate(sensor.timestamp)),
    datasets: [
      {
        label: sensorData.unit || 'unit',
        data: sensorData.payload.map((sensor) => sensor.data),
        fill: true,
        borderColor: documentStyleData.getPropertyValue('--p-cyan-500'),
        tension: 0.4,
      },
    ],
  }))
</script>

<template>
  <div class="notification-type w-full">
    <Fieldset :legend="sensorData.name" :toggleable="true">
      <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </Fieldset>
  </div>
</template>
