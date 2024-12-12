<script lang="ts" setup>
  import ListProject from '@/component/Project/ListProject.vue'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'

  const { isAdmin, listProject } = storeToRefs(useAuthStore())
</script>

<template>
  <ListProject :projects="listProject" />
</template>

<style lang="scss" scoped></style>
