<script setup lang="ts">
  import { sidebars, sidebarsForUser } from '@/constant/sidebar'
  import BaseIcon from '../BaseIcon.vue'
  import { computed, ref } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'

  const { isAdmin } = storeToRefs(useAuthStore())

  const expandedKeys = ref({
    dashboard: true,
    device: true,
  })

  // const sidebarItems = computed(() => (isAdmin.value ? sidebars : sidebarsForUser))
</script>

<template>
  <!-- iam tired for this bug , for fix temp this bug i will use this way -->
  <div class="card flex justify-center">
    <PanelMenu
      v-if="isAdmin"
      :model="sidebars"
      :expandedKeys="expandedKeys"
      class="w-full md:w-80"
      multiple
    >
      <template #item="{ item }">
        <RouterLink
          :to="{ name: item.name }"
          class="flex items-center px-4 py-2 cursor-pointer group"
        >
          <BaseIcon v-if="item.icon" :name="item.icon" size="18" />
          <span :class="['ml-2', { 'font-semibold': item.items }]">{{ item.label }}</span>
        </RouterLink>
      </template>
    </PanelMenu>

    <PanelMenu
      v-else
      :model="sidebarsForUser"
      :expandedKeys="expandedKeys"
      class="w-full md:w-80"
      multiple
    >
      <template #item="{ item }">
        <RouterLink
          :to="{ name: item.name }"
          class="flex items-center px-4 py-2 cursor-pointer group"
        >
          <BaseIcon v-if="item.icon" :name="item.icon" size="18" />
          <span :class="['ml-2', { 'font-semibold': item.items }]">{{ item.label }}</span>
        </RouterLink>
      </template>
    </PanelMenu>
  </div>
</template>
