<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue'
  import BaseIcon from '@/component/BaseIcon.vue'
  import { useRouter } from 'vue-router'
  import AppSidebar from '@/component/Sidebar/AppSidebar.vue'
  import { useAuthStore } from '@/stores/auth'
  import HeaderPage from '@/component/Header/HeaderPage.vue'

  const router = useRouter()
  const authStore = useAuthStore()

  const screenWidth = ref(window.innerWidth)
  const isCollapse = ref(window.innerWidth < 1000 ? false : true)

  const dynamicClass = computed(() => (screenWidth.value < 1000 ? `fixed` : ``))

  const updateScreenSize = () => {
    screenWidth.value = window.innerWidth

    if (screenWidth.value < 1000) isCollapse.value = false
    else isCollapse.value = true
  }

  const handleClickOutside = () => {
    if (screenWidth.value > 1000) return

    isCollapse.value = false
  }

  const handleLogout = () => {
    router.push({ name: 'login' })

    authStore.$reset()

    sessionStorage.removeItem('auth')
    localStorage.removeItem('accessToken')
  }

  onMounted(() => {
    window.addEventListener('resize', updateScreenSize)
  })
</script>

<template>
  <div class="app-layout flex flex-col h-screen">
    <!-- Header -->
    <HeaderPage @logout="handleLogout" />

    <!-- Content -->
    <div class="content flex mt-[70px] fixed w-full h-full">
      <div
        v-if="isCollapse"
        class="sidebar h-[90vh] p-2 w-[250px] border-r-2 bg-white z-50"
        :class="dynamicClass"
        v-click-outside="handleClickOutside"
      >
        <AppSidebar />
      </div>

      <BaseIcon
        v-else
        name="arrow"
        size="50"
        class="fixed bottom-5 z-50"
        @click="isCollapse = true"
      />

      <div class="main p-4 flex-1 overflow-y-auto h-full pb-20">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
