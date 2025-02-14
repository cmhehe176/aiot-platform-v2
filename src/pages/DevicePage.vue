<script lang="ts" setup>
  import { deviceService } from '@/service/device'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { onMounted, onUnmounted, ref } from 'vue'
  import DeviceList from '@/component/Device/DeviceList.vue'
  import DeviceDialog from '@/component/Device/DeviceDialog.vue'
  import { useSocket } from '@/composables/useSocket'

  const authStore = useAuthStore()
  const { connectSocket, disconnectSocket, onSocket, offSocket } = useSocket()
  const { isAdmin, listDevice } = storeToRefs(authStore)

  const devices = ref<any[]>(listDevice.value)

  const handleFetchDevice = async () => {
    if (!isAdmin.value) {
      devices.value = listDevice.value

      return
    }

    const res = await deviceService.getListDevice()
    if (!res) return

    devices.value = res
  }

  //===Mounted
  onMounted(async () => {
    await handleFetchDevice()
    connectSocket()

    onSocket('refreshApi', (data) => {
      if (data) handleFetchDevice()
    })
  })

  onUnmounted(() => {
    disconnectSocket()

    offSocket('refreshApi')
  })
</script>

<template>
  <div class="device-page">
    <DeviceList :devices="devices" @turnOffDevice="handleFetchDevice" />

    <DeviceDialog @updateDeviceSuccess="handleFetchDevice" />
  </div>
</template>
