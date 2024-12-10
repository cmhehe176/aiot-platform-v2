<script lang="ts" setup>
  import type { forEach } from 'lodash'
  import { computed, onMounted, ref, watch } from 'vue'

  interface IProps {
    messageDevice: IMessageDevice[]
  }

  interface IMessageDevice {
    id: number
    projectId: number | null
    name: string | null
    object: number
    sensor: number
    notification: number
  }

  const { messageDevice } = defineProps<IProps>()

  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color')
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color')

  const chartData = computed(() => ({
    labels: messageDevice.map((device) => device.name),
    datasets: [
      {
        label: 'object',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: messageDevice.map((device) => device.object),
      },
      {
        label: 'sensor',
        backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        data: messageDevice.map((device) => device.sensor),
      },
      {
        label: 'notification',
        backgroundColor: documentStyle.getPropertyValue('--p-text-500'),
        borderColor: documentStyle.getPropertyValue('--p-text-500'),
        data: messageDevice.map((device) => device.notification),
      },
    ],
  }))

  const chartOptions = ref({
    maintainAspectRatio: false,
    aspectRatio: 0.8,
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
          font: {
            weight: 500,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
          drawBorder: false,
        },
      },
    },
  })
</script>

<template>
  <div class="message-device min-w-[500px]">
    <Fieldset legend="Message Of Device" :toggleable="true">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="min-h-[15rem]" />
    </Fieldset>
  </div>
</template>

<style lang="scss">
  .message-device {
    .p-fieldset {
      // max-height: 295px;
    }
  }
</style>
