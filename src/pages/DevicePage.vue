<script lang="ts" setup>
  import { deviceService } from '@/service/device'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref } from 'vue'
  import DeviceList from '@/component/Device/DeviceList.vue'
  import DeviceDialog from '@/component/Device/DeviceDialog.vue'

  const authStore = useAuthStore()
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

  onMounted(async () => await handleFetchDevice())
</script>

<template>
  <div class="device-page">
    <DeviceList :devices="devices" />

    <DeviceDialog @updateDeviceSuccess="handleFetchDevice" />
  </div>
</template>
