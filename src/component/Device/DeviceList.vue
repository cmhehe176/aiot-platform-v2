<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { formatDate } from '@/utils/dayjs'
  import { emitter } from '@/utils/mitt'
  import { ref } from 'vue'
  import { deviceService } from '@/service/device'
  import { ElNotification } from 'element-plus'

  const authStore = useAuthStore()
  const { isAdmin } = storeToRefs(authStore)
  const emit = defineEmits(['turnOffDevice'])

  const { devices } = defineProps<{ devices: any }>()

  const handleActiveDevice = async (status: boolean, deviceId: number) => {
    if (!status || !isAdmin.value) return

    const res = await deviceService.turnOffDevice(deviceId)

    if (!res)
      return ElNotification({
        title: 'Turn Off Device Error',
        message: 'Error',
        type: 'error',
        duration: 2000,
      })

    emit('turnOffDevice')
    ElNotification({
      title: 'Turn Off Device',
      message: 'Success',
      type: 'success',
      duration: 2000,
    })
  }
</script>

<template>
  <div class="list-device">
    <DataTable :value="devices" tableStyle="min-width: 5rem">
      <template #header>
        <span class="text-xl font-bold ml-8">Devices</span>
      </template>

      <Column header="Status" class="status flex justify-center">
        <template #body="{ data }">
          <ToggleButton
            v-model="data.isActive"
            onLabel="Active"
            offLabel="InActive"
            class="w-36"
            readonly
            @click="handleActiveDevice(data.isActive, data.id)"
          />

          <!-- <Dialog
            v-model:visible="isDialog"
            modal
            header="Confirm turn off Device"
            :style="{ width: '50vh' }"
          >
            <Button
              class="w-28"
              label="Submit"
              text
              outlined
              severity="info"
              @click="handleSubmit"
            />
          </Dialog> -->
        </template>
      </Column>

      <Column field="id" header="Id"></Column>

      <Column field="name" header="Name"></Column>

      <Column field="project.name" header="Project"></Column>

      <Column header="CreatedAt">
        <template #body="{ data }"> {{ formatDate(data.createdAt) }}</template>
      </Column>

      <Column header="UpdatedAt">
        <template #body="{ data }"> {{ formatDate(data.updatedAt) }}</template>
      </Column>

      <Column v-if="isAdmin" header="Action">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button
              label="Setting"
              outlined
              severity="secondary"
              @click="emitter.emit('editDevice', data)"
            />
            <!-- <Button
              label="Delete"
              outlined
              severity="danger"
              @click="emitter.emit('deleteDevice', data)"
            /> -->
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped></style>
