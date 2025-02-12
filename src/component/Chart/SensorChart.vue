<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { formatDate } from '@/utils/dayjs'
  import BaseIcon from '../BaseIcon.vue'

  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')
  const documentStyleData = getComputedStyle(document.documentElement)

  const { sensorData } = defineProps<{ sensorData: any }>()

  const chartOptions = computed(() => {
    const annotations = {}

    if (sensorData.lower_limit) {
      annotations['line1'] = {
        type: 'line',
        yMin: sensorData.lower_limit,
        yMax: sensorData.lower_limit,
        borderColor: 'green',
        borderWidth: 2,
        borderDash: [5, 5],
        label: {
          enabled: true,
          content: 'Ngưỡng dưới',
        },
      }
    }

    if (sensorData.upper_limit) {
      annotations['line2'] = {
        type: 'line',
        yMin: sensorData.upper_limit,
        yMax: sensorData.upper_limit,
        borderColor: 'red',
        borderWidth: 3,
        borderDash: [5, 5],
        label: {
          enabled: true,
          content: 'Ngưỡng trên',
        },
      }
    }

    return {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        annotation: {
          annotations,
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
    }
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
  <div class="sensor w-full">
    <Fieldset toggleable>
      <template #legend>
        <Button text severity="secondary" @click="() => console.log('hello')">
          <BaseIcon name="setting" :size="20" />

          <span class="font-bold">
            {{ sensorData.name }}
          </span>
        </Button>
      </template>

      <Chart type="line" :data="chartData" :options="chartOptions" class="h-[30rem]" />
    </Fieldset>
  </div>
</template>
