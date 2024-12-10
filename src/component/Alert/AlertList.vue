<script lang="ts" setup>
  const { alertList, type } = defineProps<{
    alertList: any
    type: 'object' | 'notification' | 'sensor'
  }>()
</script>

<template>
  <DataView :value="alertList" paginator :rows="5" dataKey="id">
    <!-- <template #list="{ data }"> </template> -->
  </DataView>
</template>

<style lang="scss" scoped></style>
