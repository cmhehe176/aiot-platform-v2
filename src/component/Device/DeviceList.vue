<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { formatDate } from '@/utils/dayjs'
  import { emitter } from '@/utils/mitt'

  const authStore = useAuthStore()
  const { isAdmin } = storeToRefs(authStore)

  const { devices } = defineProps<{ devices: any }>()
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
            <Button
              label="Edit"
              outlined
              severity="secondary"
              @click="emitter.emit('editDevice', data)"
            />
            <Button
              label="Delete"
              outlined
              severity="danger"
              @click="emitter.emit('deleteDevice', data)"
            />
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style lang="scss" scoped></style>
