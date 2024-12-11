<script lang="ts" setup>
  import ObjectMessage from '@/component/Alert/ObjectMessage.vue'
  import FilterProject from '@/component/FilterProject.vue'
  import { objectService } from '@/service/object'
  import { onMounted, ref } from 'vue'

  const tabValue = ref('notification')
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
  <div v-if="tabValue === 'object'" class="overflow-y-auto">
    <ObjectMessage v-for="data in datas" :key="data.id" :alert="data" />
  </div>

  <div v-else>nothing</div>
</template>

<style lang="scss" scoped>
  .filter-alert {
  }
</style>
