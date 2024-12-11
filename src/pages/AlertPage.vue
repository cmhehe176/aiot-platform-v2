<script lang="ts" setup>
  import AlertItem from '@/component/Alert/AlertItem.vue'
  import FilterProject from '@/component/FilterProject.vue'
  import { objectService } from '@/service/object'
  import { onMounted, ref } from 'vue'

  const tabValue = ref('object')
  const datas = ref()
  const total = ref()
  const handleFetchApi = async () => {
    const res = await objectService.getMessage()

    if (!res) return

    datas.value = res.data
    total.value = res.total
  }

  onMounted(async () => await handleFetchApi())
</script>

<template>
  <FilterProject
    class="filter-alert"
    :filter="{ project: true, device: true, datePicker: true, typeObject: true, tabs: true }"
    v-model:tabs="tabValue"
  />
  <div class="overflow-y-auto">
    <AlertItem v-for="data in datas" :key="data.id" :alert="data" />
  </div>
</template>

<style lang="scss" scoped>
  .filter-alert {
  }
</style>
