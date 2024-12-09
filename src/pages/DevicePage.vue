<script lang="ts" setup>
  import { deviceService } from '@/service/device'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { onMounted, ref } from 'vue'
  import { formatDate } from '@/utils/dayjs'

  const authStore = useAuthStore()
  const { isAdmin, listDevice } = storeToRefs(authStore)

  const device = ref(listDevice.value)

  const handleEdit = (data) => {
    console.log(data)
  }

  const handleDelete = (data) => {
    console.log(data)
  }

  onMounted(async () => {
    if (!isAdmin.value) return

    const res = await deviceService.getListDevice()
    if (!res) return

    device.value = res
  })
</script>

<template>
  <div class="device-page">
    <DataTable :value="device" tableStyle="min-width: 5rem">
      <template #header>
        <span class="text-xl font-bold">Devices</span>
      </template>

      <Column header="Status" class="test">
        <template #body="{ data }">
          <ToggleButton
            v-model="data.isActive"
            onLabel="Active"
            offLabel="InActive"
            class="w-36"
            disabled
          />
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
            <Button label="Edit" outlined severity="secondary" @click="handleEdit(data)" />
            <Button label="Delete" outlined severity="danger" @click="handleDelete(data)" />
          </div>
        </template>
      </Column>

      <!-- <Column header="Status">
        <template #body="slotProps">
          <Tag :value="slotProps.data.inventoryStatus" :severity="getSeverity(slotProps.data)" />
        </template>
      </Column>   -->
    </DataTable>
  </div>
</template>

<style lang="scss"></style>
