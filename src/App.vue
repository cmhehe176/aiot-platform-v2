<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router'
  import { computed } from 'vue'
  import AppLayout from './layout/AppLayout.vue'

  const route = useRoute()

  const layout = computed(() => route.meta.layout || AppLayout)
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
