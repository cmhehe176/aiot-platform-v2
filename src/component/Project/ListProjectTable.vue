<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import { formatDate } from '@/utils/dayjs'
  import { storeToRefs } from 'pinia'
  import { ref } from 'vue'

  const { listProject } = storeToRefs(useAuthStore())
  const { selectionMode = false } = defineProps<{ selectionMode?: boolean }>()

  const selectedProject = defineModel()

  const _bind = selectionMode ? { selectionMode: 'single' as any } : {}
</script>

<template>
  <div class="list-device">
    <DataTable
      stripedRows
      v-bind="_bind"
      :value="listProject"
      v-model:selection="selectedProject"
      tableStyle="min-width: 5rem"
      dataKey="id"
    >
      <template #header>
        <span class="text-xl font-bold ml-8">List Project</span>
      </template>

      <Column field="id" header="Id"></Column>

      <Column field="name" header="Name"></Column>

      <Column header="CreateBy">
        <template #body="{ data }"> {{ data.createdBy.name }}</template>
      </Column>

      <Column header="CreatedAt">
        <template #body="{ data }"> {{ formatDate(data.createdAt) }}</template>
      </Column>

      <Column header="UpdatedAt">
        <template #body="{ data }"> {{ formatDate(data.updatedAt) }}</template>
      </Column>
    </DataTable>
  </div>
</template>
