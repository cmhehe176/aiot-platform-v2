<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--p-text-color')

  onMounted(() => {
    chartData.value = setChartData()
  })

  const { statusNotification, type } = defineProps<{ statusNotification: any; type: string }>()

  const chartData = ref()
  const chartOptions = ref({
    plugins: {
      legend: {
        labels: {
          cutout: '60%',
          color: textColor,
        },
      },
    },
  })

  const setChartData = () => {
    const documentStyle = getComputedStyle(document.body)

    return {
      labels: statusNotification.map((message) => message.status),
      datasets: [
        {
          data: statusNotification.map((message) => message.count),
          backgroundColor: [
            documentStyle.getPropertyValue('--p-orange-500'),
            documentStyle.getPropertyValue('--p-cyan-500'),
            documentStyle.getPropertyValue('--p-gray-500'),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--p-orange-400'),
            documentStyle.getPropertyValue('--p-cyan-400'),
            documentStyle.getPropertyValue('--p-gray-400'),
          ],
        },
      ],
    }
  }
</script>

<template>
  <div class="card flex justify-center">
    <Fieldset :legend="type" :toggleable="true">
      <Chart
        type="doughnut"
        :data="chartData"
        :options="chartOptions"
        class="h-[15rem] flex justify-center"
      />
    </Fieldset>
  </div>
</template>
