<script setup lang="ts">
  import { deviceService } from '@/service/device'
  import { emitter } from '@/utils/mitt'
  import { reactive, ref } from 'vue'

  const isDialog = ref<boolean>(false)
  const deviceDetail = ref()
  const emit = defineEmits(['updateDeviceSuccess'])

  const form = reactive({
    name: '',
    projectId: NaN,
  })

  const handleOpenEdit = (data) => {
    isDialog.value = true

    deviceDetail.value = data
    form.name = data.name
  }

  const handleSave = async () => {
    const res = await deviceService.updateDevice(deviceDetail.value.id, form)

    if (!res.message) return

    emit('updateDeviceSuccess')
    isDialog.value = false
  }

  emitter.on('editDevice', handleOpenEdit)
</script>

<template>
  <div class="device-dialog flex justify-center">
    <Dialog v-model:visible="isDialog" modal header="Update Device" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8"> Update your of Device.</span>

      <IftaLabel style="width: 100%" class="label-input w-full">
        <InputText id="device" v-model="form.name" />
        <label for="device">Name Device :</label>
      </IftaLabel>

      <Button class="my-9" variant="text" severity="secondary">
        <span class="text-xl font-bold" v-if="deviceDetail.project">
          Project :
          <Button variant="text" class="font-bold" severity="info">
            {{ deviceDetail.project.name }}
          </Button>
        </span>

        <span class="text-xl" v-else>Add Device to Project</span>
      </Button>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="isDialog = false" />

        <Button type="button" label="Save" severity="info" @click="handleSave" />
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss">
  .label-input {
    .p-inputtext.p-component {
      width: 100%;
    }
  }
</style>
