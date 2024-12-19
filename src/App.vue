<script setup lang="ts">
  import { RouterView, useRoute } from 'vue-router'
  import { computed } from 'vue'
  import AppLayout from './layout/AppLayout.vue'
  import { storeToRefs } from 'pinia'
  import { useLoadingStore } from './stores/loading'
  import AppLoading from './component/AppLoading.vue'

  const route = useRoute()

  const { loading } = storeToRefs(useLoadingStore())

  const layout = computed(() => route.meta.layout || AppLayout)
</script>

<template>
  <AppLoading v-if="loading" />

  <component v-else :is="layout">
    <RouterView />
  </component>
</template>
