<script lang="ts" setup>
  import { useSocket } from '@/composables/useSocket'
  import { onMounted } from 'vue'

  const { connectSocket } = useSocket()

  onMounted(() => {
    connectSocket()
  })
</script>

<template>support management</template>

<style lang="scss" scoped></style>
