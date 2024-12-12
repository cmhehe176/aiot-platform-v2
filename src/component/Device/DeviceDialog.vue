<script setup lang="ts">
  import { deviceService } from '@/service/device'
  import { emitter } from '@/utils/mitt'
  import { reactive, ref, watch } from 'vue'
  import ListProjectTable from '../Project/ListProjectTable.vue'
  import BaseIcon from '../BaseIcon.vue'
  import { useAuthStore } from '@/stores/auth'

  const emit = defineEmits(['updateDeviceSuccess'])
  const { listProject } = useAuthStore()

  const isDialog = ref<boolean>(false)
  const isAddProject = ref<boolean>(false)
  const deviceDetail = ref()

  const form = reactive({
    name: '',
    project: undefined,
  })

  const handleOpenEdit = (data) => {
    isDialog.value = true

    deviceDetail.value = data

    form.name = data.name
    form.project = data.id
  }

  const handleSave = async () => {
    const res = await deviceService.updateDevice(deviceDetail.value.id, {
      name: form.name,
      projectId: form.project.id || undefined,
    })

    if (!res.message) return

    emit('updateDeviceSuccess')
    isDialog.value = false
  }

  watch(
    () => isDialog.value,
    (newValue) => {
      if (newValue) return

      form.name = ''
      form.project = undefined
    },
  )

  emitter.on('editDevice', handleOpenEdit)
</script>

<template>
  <div class="device-dialog flex justify-center">
    <!-- dialog device -->
    <Dialog v-model:visible="isDialog" modal header="Update Device" :style="{ width: '25rem' }">
      <span class="text-surface-500 dark:text-surface-400 block mb-8"> Update your of Device.</span>

      <IftaLabel style="width: 100%" class="label-input w-full">
        <InputText id="device" v-model="form.name" />
        <label for="device">Name Device :</label>
      </IftaLabel>

      <Button class="my-9" variant="text" severity="secondary" @click="isAddProject = true">
        <span class="font-bold" v-if="form.project?.name || deviceDetail.project">
          Project :
          <Button variant="text" class="text-xl font-bold" severity="info">
            {{ form.project?.name || deviceDetail.project.name }}
          </Button>
        </span>

        <span class="text-xl" v-else>Add Device to Project</span>
      </Button>

      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="isDialog = false" />

        <Button type="button" label="Save" severity="info" @click="handleSave" />
      </div>
    </Dialog>

    <!-- dialog add project  -->
    <Dialog
      v-model:visible="isAddProject"
      :style="{ width: '55rem', height: '25rem' }"
      :closable="false"
      class="dialog-select-project"
    >
      <template #header>
        <Button severity="info" @click="isAddProject = false">
          <BaseIcon name="check" size="30" />
        </Button>
      </template>

      <ListProjectTable selectionMode v-model="form.project" :projects="listProject" />
    </Dialog>
  </div>
</template>

<style lang="scss">
  .label-input {
    .p-inputtext.p-component {
      width: 100%;
    }
  }

  .dialog-select-project {
    .p-dialog-header {
      display: flex;
      flex-direction: row-reverse;
      padding: 0;
      padding-top: 20px;
      padding-right: 40px;
    }
  }
</style>
