<script lang="ts" setup>
  import ListProject from '@/component/Project/ListProject.vue'
  import { useAuthStore } from '@/stores/auth'

  const { isAdmin } = useAuthStore()
</script>

<template>
  <div class="flex flex-col gap-2 flex-wrap">
    <Button v-if="isAdmin" class="w-28" label="Add Project" text outlined severity="info" />
    <ListProject />
  </div>
</template>

<style lang="scss" scoped></style>
