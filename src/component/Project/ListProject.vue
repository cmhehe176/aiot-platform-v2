<!-- eslint-disable @typescript-eslint/no-unused-expressions -->
<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import ProjectItem from './ProjectItem.vue'
  import { storeToRefs } from 'pinia'
  import { onMounted, reactive, ref } from 'vue'
  import { userService } from '@/service/user'
  import { projectService } from '@/service/project'
  import { useAuth } from '@/composables/useAuth'
  import { deviceService } from '@/service/device'
  import { ElMessage } from 'element-plus'

  const { isAdmin } = storeToRefs(useAuthStore())
  const { fetchApiProfile } = useAuth()

  const { projects } = defineProps<{ projects: any }>()

  const isDialog = ref(false)
  const users = ref()
  const devices = ref()

  const initState = {
    id: NaN,
    action: '',
    name: '',
    userIds: [],
    description: '',
    deviceIds: [],
  }

  const state = reactive({ ...initState })

  const handleDelete = (id: number) => {
    projectService.deleteProject(id).finally(async () => {
      const res = await fetchApiProfile()

      res.statusCode === 500
        ? ElMessage({ message: 'Delete Project failed', type: 'error' })
        : ElMessage({ message: 'Delete Project success', type: 'success' })
    })
  }

  const handleDetail = () => {}

  const handleEdit = async (data) => {
    state.action = 'edit'

    const listDevice = await deviceService.getListDevice()
    const listUser = await userService.getUserByProject(data.id)

    state.id = data.id
    state.description = data.description
    state.name = data.name
    state.deviceIds = data.device.map((d) => d.id)
    state.userIds = listUser.data.length ? listUser.data.map((user) => user.id) : []

    devices.value = listDevice
    isDialog.value = true
  }

  const handleCreate = async () => {
    state.action = 'create'
    const res = await deviceService.getlistDeviceFree()

    devices.value = res

    isDialog.value = true
  }

  const onSubmit = async () => {
    if (state.action === 'create') {
      delete state.action
      delete state.id

      const res = await projectService.createProject(state)

      res.statusCode === 500
        ? ElMessage({ message: 'Create Project failed', type: 'error' })
        : ElMessage({ message: 'Create Project success', type: 'success' })
    }

    if (state.action === 'edit') {
      delete state.action

      const res = await projectService.updateProject(state)

      res.statusCode === 500
        ? ElMessage({ message: 'Update Project failed', type: 'error' })
        : ElMessage({ message: 'Update Project success', type: 'success' })
    }

    await fetchApiProfile()
    handleCloseDialog()
  }

  const handleCloseDialog = () => {
    isDialog.value = false
    Object.assign(state, { ...initState })
  }

  onMounted(async () => {
    const data = await userService.getAllUser()

    users.value = data
  })
</script>

<template>
  <div>
    <Button
      v-if="isAdmin"
      class="w-28"
      label="Add Project"
      text
      outlined
      severity="info"
      @click="handleCreate"
    />

    <div class="flex flex-wrap gap-8 w-full">
      <ProjectItem
        v-for="project in projects"
        :key="project.id"
        :project="project"
        @edit="handleEdit"
        @delete="handleDelete"
        @detail="handleDetail"
      />
    </div>

    <Dialog
      v-model:visible="isDialog"
      class="edit-project"
      modal
      position="top"
      header="Header"
      :style="{ width: '50vh' }"
      v-on:after-hide="handleCloseDialog"
    >
      <div class="flex flex-col gap-[20px]">
        <IftaLabel>
          <InputText id="name" v-model="state.name" />
          <label for="name">Name of Project</label>
        </IftaLabel>

        <IftaLabel>
          <MultiSelect
            v-model="state.userIds"
            display="chip"
            :options="users"
            optionLabel="name"
            optionValue="id"
            filter
            class="w-full"
            id="user"
          />
          <label for="user">Select User to Project</label>
        </IftaLabel>

        <IftaLabel>
          <MultiSelect
            v-model="state.deviceIds"
            display="chip"
            :options="devices"
            optionLabel="name"
            optionValue="id"
            filter
            class="w-full"
            id="user"
          />
          <label for="user">Select Devices to Project</label>
        </IftaLabel>

        <IftaLabel>
          <Textarea id="desctiption" v-model="state.description" rows="5" cols="30" />
          <label for="desctiption">Description</label>
        </IftaLabel>

        <!-- button accept or cancel -->
        <div class="flex justify-end">
          <Button
            class="w-28"
            label="Cancel"
            text
            outlined
            severity="info"
            @click="handleCloseDialog"
          />
          <Button class="w-28" label="Submit" text outlined severity="info" @click="onSubmit" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss">
  .edit-project {
    .p-dialog-content {
      .p-iftalabel {
        input {
          width: 100%;
        }
        textarea {
          width: 100%;
        }
      }

      .p-multiselect-label {
        height: auto;
      }

      .p-multiselect-label-container {
        min-height: fit-content;

        .p-multiselect-label {
          margin-top: 20px;
          display: flex;
          flex-wrap: wrap;
        }

        .p-multiselect-label.p-placeholder.p-multiselect-label-empty {
          margin-top: 0;
        }
      }
    }
  }
</style>
