<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref } from 'vue'
  import { optionsTypes } from '@/constant/optionsType'

  const authStore = useAuthStore()

  const { getListDeviceByProject } = useAuthStore()
  const { listProject, listDeviceByProject, isAdmin } = storeToRefs(authStore)

  const { filter } = defineProps<{
    filter: {
      project?: boolean
      datePicker?: boolean
      device?: boolean
      typeObject?: boolean
      tabs?: boolean
    }
  }>()

  const emit = defineEmits(['project', 'device', 'datePicker', 'typeObject'])

  const projectOptions = computed(() =>
    isAdmin.value ? [{ id: -1, name: 'All' }, ...listProject.value] : listProject.value,
  )

  const deviceOptions = computed(() => [{ id: -1, name: 'All' }, ...listDeviceByProject.value])

  const modelProject = defineModel<number>('project')
  const modelDevice = defineModel<number>('device')
  const modelDatePicker = defineModel<any>('datePicker')
  const modelTypeObject = defineModel<string>('typeObject')
  const modelTabs = defineModel<string>('tabs')

  const handleChangeProject = (projectId) => {
    getListDeviceByProject(projectId)
    emit('project')
  }

  onMounted(() => {
    modelProject.value = projectOptions.value[0].id
  })
</script>

<template>
  <div class="filter flex flex-wrap w-full gap-10">
    <div v-if="filter.tabs" class="mr-10">
      <SelectButton
        v-model="modelTabs"
        :options="isAdmin ? ['object', 'notification', 'sensor'] : ['notification']"
      />
    </div>

    <FloatLabel v-if="filter.project" variant="on" class="md:w-52">
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

    <FloatLabel v-if="filter.device" variant="on" class="md:w-52 w-24">
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

    <FloatLabel v-if="filter.datePicker" variant="on" class="md:w-52">
      <DatePicker
        v-model="modelDatePicker"
        selectionMode="range"
        inputId="datepicker"
        class="w-full"
        dateFormat="dd/mm/yy"
        showButtonBar
        @value-change="emit('datePicker')"
      />
      <label for="datepicker">Select Date</label>
    </FloatLabel>

    <FloatLabel v-if="filter.typeObject" variant="on" class="w-36">
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

<style lang="scss">
  .filter {
    .item {
      display: flex;
      flex-direction: column;
    }
  }
  .filter-tabs {
    .p-tab.p-tab-active {
      color: #606363 !important;
    }
  }
</style>
