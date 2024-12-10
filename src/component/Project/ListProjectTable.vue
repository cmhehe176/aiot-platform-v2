<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import { formatDate } from '@/utils/dayjs'
  import { storeToRefs } from 'pinia'

  const { selectionMode = false, projects } = defineProps<{
    selectionMode?: boolean
    projects: any[]
  }>()

  const selectedProject = defineModel()

  const _bind = selectionMode ? { selectionMode: 'single' as any } : {}
</script>

<template>
  <div class="list-device">
    <DataTable
      stripedRows
      v-bind="_bind"
      :value="projects"
      v-model:selection="selectedProject"
      tableStyle="min-width: 5rem"
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
