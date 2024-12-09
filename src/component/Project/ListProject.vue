<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import ProjectItem from './ProjectItem.vue'

  const { listProject } = useAuthStore()
</script>

<template>
  <div class="flex flex-wrap gap-8 w-full">
    <ProjectItem
      v-for="project in listProject"
      :key="project.id"
      :name="project.name"
      :description="project.description"
    />
  </div>
</template>

<style lang="scss" scoped></style>
