import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', () => {
  const loading = ref(true)

  const clearLoading = () => {
    loading.value = false
  }

  return {
    clearLoading,
    loading,
  }
})
