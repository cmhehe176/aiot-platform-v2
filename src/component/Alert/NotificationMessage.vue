<script lang="ts" setup>
  import { formatDate } from '@/utils/dayjs'
  import { computed } from 'vue'
  import type { NotificationMessage } from './type'

  const { alert } = defineProps<{ alert: NotificationMessage }>()

  const date = computed<any>(() => formatDate(alert.timestamp) || 'inValid Time')
</script>

<template>
  <Fieldset :legend="date">
    <div class="p-1"><span class="font-bold"> Device :</span> {{ alert.device.name }}</div>
    <div class="p-1"><span class="font-bold"> Payload : </span> {{ alert.payload }}</div>
  </Fieldset>
</template>

<style lang="scss" scoped></style>
