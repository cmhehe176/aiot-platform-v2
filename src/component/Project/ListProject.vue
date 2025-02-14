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
  import { formatDate } from '@/utils/dayjs'

  const { isAdmin } = storeToRefs(useAuthStore())
  const { fetchApiProfile } = useAuth()

  const { projects } = defineProps<{ projects: any }>()

  const isDialog = ref(false)
  const isDialogDetail = ref(false)
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

  const projectDetail = ref()

  const handleDelete = (id: number) => {
    projectService.deleteProject(id).finally(async () => {
      const res = await fetchApiProfile()

      res.statusCode === 500
        ? ElMessage({ message: 'Delete Project failed', type: 'error' })
        : ElMessage({ message: 'Delete Project success', type: 'success' })
    })
  }

  const handleDetail = async (data) => {
    try {
      isDialogDetail.value = true

      projectDetail.value = data
      const listUserInProject = await projectService.userInProject(data.id)

      projectDetail.value.users = listUserInProject
    } catch (error) {
      console.error(error)
    }
  }

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

    <!-- update -->
    <Dialog
      v-model:visible="isDialog"
      class="edit-project"
      modal
      position="top"
      header="Update Project"
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

    <!-- detail -->
    <Dialog
      v-model:visible="isDialogDetail"
      class="detail-project"
      modal
      position="top"
      header="Project Detail"
      :style="{ width: '50vh' }"
    >
      <div class="flex flex-col gap-4">
        <!-- Project Name -->
        <div class="flex justify-between">
          <span class="font-bold">Project Name:</span>
          <span>{{ projectDetail?.name }}</span>
        </div>

        <!-- Created By -->
        <div v-if="projectDetail?.createdBy" class="flex justify-between">
          <span class="font-bold">Created By:</span>
          <span>{{ projectDetail?.createdBy?.name }}</span>
        </div>

        <!-- Created At -->
        <div class="flex justify-between">
          <span class="font-bold">Created At:</span>
          <span>{{ formatDate(projectDetail?.createdAt) }}</span>
        </div>

        <!-- Description -->
        <div class="flex flex-col">
          <span class="font-bold">Description:</span>
          <p v-if="projectDetail?.description" class="text-justify">
            {{ projectDetail?.description }}
          </p>
          <p v-else class="italic text-gray-500">No description available.</p>
        </div>

        <!-- Users -->
        <div>
          <span class="font-bold">Users:</span>
          <ul class="ml-5 flex flex-col gap-1">
            <li v-for="user in projectDetail.users" :key="user.id" class="text-sm">
              <div>
                <strong>{{ user.name }}</strong> - {{ user.email }}
                <span v-if="user.roleId === 0" class="text-red-500">[Super Admin]</span>
                <span v-else-if="user.roleId === 1" class="text-blue-500">[Admin]</span>
                <span v-else class="text-green-500">[User]</span>
              </div>
              <div>Phone: {{ user.telephone }}</div>
            </li>
          </ul>
        </div>
        <!-- Devices -->
        <div>
          <span class="font-bold">Devices:</span>
          <ul v-if="projectDetail.device.length" class="flex flex-col gap-1">
            <li v-for="(device, index) in projectDetail.device" :key="device.id" class="text-sm">
              {{ index }}: {{ device.name }} (MAC: {{ device.mac_address }})
            </li>
          </ul>

          <p v-else class="italic text-gray-500">No devices available.</p>
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
