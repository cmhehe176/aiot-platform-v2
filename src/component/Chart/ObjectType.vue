<script setup lang="ts">
  import { ref, onMounted, watch, computed } from 'vue'

  type TObjectType = {
    id: number
    projectId: number
    name: string
    human: number
    vehicle: number
    all: number
  }

  const { objectType } = defineProps<{ objectType: TObjectType[] }>()

  const chartData = computed(() => ({
    labels: objectType.map((object) => object.name || 'inValidName'),
    datasets: [
      {
        type: 'bar',
        label: 'Both Detect',
        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        data: [0, 1213],
        stack: 'group1',
      },
      {
        type: 'bar',
        label: 'Human',
        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
        data: [0, 642],
        stack: 'group2',
      },
      {
        type: 'bar',
        label: 'Vehicle',
        backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
        borderColor: documentStyle.getPropertyValue('--p-orange-500'),
        data: [0, 312],
        stack: 'group2',
      },
    ],
  }))
  const chartOptions = ref()

  const documentStyle = getComputedStyle(document.documentElement)

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
          ticks: {
            color: textColorSecondary,
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
    }
  }

  onMounted(() => {
    chartOptions.value = setChartOptions()
  })
</script>

<template>
  <div class="object-type w-1/2">
    <Fieldset legend="Type Of Object" :toggleable="true">
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[15rem]" />
    </Fieldset>
  </div>
</template>
