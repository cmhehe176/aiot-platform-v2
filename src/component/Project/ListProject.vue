<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import ProjectItem from './ProjectItem.vue'
  import { storeToRefs } from 'pinia'
  import { reactive, ref } from 'vue'
  import { userService } from '@/service/user'
  import { projectService } from '@/service/project'
  import { authService } from '@/service/auth'
  import { useAuth } from '@/composables/useAuth'
  import { deviceService } from '@/service/device'

  const { isAdmin } = storeToRefs(useAuthStore())
  const { fetchApiProfile } = useAuth()

  const { projects } = defineProps<{ projects: any }>()

  const isDialog = ref(false)
  const users = ref()
  const devices = ref()

  const initState = {
    action: '',
    name: '',
    users: [],
    description: '',
    deviceIds: [],
  }

  const state = reactive({ ...initState })

  const handleDialog = () => {
    isDialog.value = !isDialog.value
  }

  const handleDelete = () => {}
  const handleDetail = () => {}
  const handleEdit = () => {
    handleDialog()
  }

  const handleCreate = async () => {
    state.action = 'create'
    const { items } = await userService.getAllUser()
    const res = await deviceService.getlistDeviceFree()

    devices.value = res
    users.value = items

    handleDialog()
  }

  const onSubmit = () => {
    if (state.action === 'create') {
      delete state.action

      projectService.createProject(state)
    }

    if (state.action === 'edit') {
      console.log(state)
    }

    fetchApiProfile()
    Object.assign(state, { ...initState })
  }
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
        :name="project.name"
        :description="project.description"
        @edit="handleEdit"
        @delete="handleDelete"
        @detail="handleDetail"
      />
    </div>

    <Dialog
      v-model:visible="isDialog"
      modal
      position="top"
      header="Header"
      :style="{ width: '50vh' }"
      class="edit-project"
    >
      <div class="flex flex-col gap-[20px]">
        <IftaLabel>
          <InputText id="name" v-model="state.name" />
          <label for="name">Name of Project</label>
        </IftaLabel>

        <IftaLabel>
          <MultiSelect
            v-model="state.users"
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
          <Button class="w-28" label="Cancel" text outlined severity="info" @click="handleDialog" />
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
