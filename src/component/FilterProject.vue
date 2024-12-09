<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref } from 'vue'
  import { optionsTypes } from '@/constant/optionsType'

  const authStore = useAuthStore()

  const { getListDeviceByProject } = useAuthStore()
  const { listProject, listDeviceByProject, isAdmin } = storeToRefs(authStore)

  const projectOptions = computed(() =>
    isAdmin.value ? [{ id: -1, name: 'All' }, ...listProject.value] : listProject.value,
  )

  const deviceOptions = computed(() => [{ id: -1, name: 'All' }, ...listDeviceByProject.value])

  const modelProject = defineModel<number>('project')
  const modelDevice = defineModel<number>('device')
  const modelDatePicker = defineModel<any>('datePicker')
  const modelTypeObject = defineModel<string>('typeObject')

  const handleChangeProject = (projectId) => {
    getListDeviceByProject(projectId)
  }

  onMounted(() => {
    modelProject.value = projectOptions.value[0].id
  })
</script>

<template>
  <div class="filter flex flex-wrap w-full gap-10">
    <FloatLabel variant="on" class="md:w-52">
      <Select
        v-model="modelProject"
        inputId="project"
        :options="projectOptions"
        optionLabel="name"
        optionValue="id"
        class="w-full"
        @change="({ value }) => handleChangeProject(value)"
      />
      <label for="project">Project</label>
    </FloatLabel>

    <FloatLabel variant="on" class="md:w-52">
      <Select
        v-model="modelDevice"
        inputId="device"
        :options="deviceOptions"
        optionLabel="name"
        optionValue="id"
        class="w-full"
      />
      <label for="device">Device</label>
    </FloatLabel>

    <FloatLabel variant="on" class="md:w-52">
      <DatePicker
        v-model="modelDatePicker"
        selectionMode="range"
        inputId="datepicker"
        class="w-full"
        dateFormat="dd/mm/yy"
        showButtonBar
      />
      <label for="datepicker">Select Date</label>
    </FloatLabel>

    <FloatLabel variant="on" class="w-36">
      <Select
        v-model="modelTypeObject"
        inputId="type"
        :options="optionsTypes"
        optionLabel="name"
        optionValue="value"
        class="w-full"
      />
      <label for="type">Object Type</label>
    </FloatLabel>
  </div>
</template>

<style lang="scss" scoped>
  .filter {
    .item {
      display: flex;
      flex-direction: column;
    }
  }
</style>
