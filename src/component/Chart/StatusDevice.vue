<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  type TProps = {
    statusDevice: {
      total: number
      deviceActive: number
      deviceInActive: number
    }
  }
  const { statusDevice } = defineProps<TProps>()

  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')
  const documentStyleBody = getComputedStyle(document.body)

  const chartOptions = ref({
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
          color: textColor,
        },
      },
    },
  })

  const chartData = computed(() => ({
    labels: ['Active', 'InActive'],
    datasets: [
      {
        data: [statusDevice.deviceActive, statusDevice.deviceInActive],
        backgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyleBody.getPropertyValue('--p-gray-500'),
        ],
        hoverBackgroundColor: [
          documentStyle.getPropertyValue('--p-cyan-500'),
          documentStyleBody.getPropertyValue('--p-gray-400'),
        ],
      },
    ],
  }))
</script>

<template>
  <div class="">
    <Fieldset legend="Status Of Device" :toggleable="true">
      <Chart
        :canvasProps="{ width: 240, height: 240, id: 'statusDevice' }"
        type="pie"
        :data="chartData"
        :options="chartOptions"
        class="h-[15rem] flex justify-center"
      />
    </Fieldset>
  </div>
</template>
