<script lang="ts" setup>
  import { formatDate } from '@/utils/dayjs'
  import { computed } from 'vue'
  import type { NotificationMessage } from './type'

  const { alert } = defineProps<{ alert: NotificationMessage }>()

  const date = computed<any>(() => formatDate(alert.timestamp) || 'inValid Time')
</script>

<template>
  <Fieldset :legend="date">sensor message </Fieldset>
</template>

<style lang="scss" scoped></style>
