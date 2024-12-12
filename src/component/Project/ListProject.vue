<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'
  import ProjectItem from './ProjectItem.vue'
  import { storeToRefs } from 'pinia'
  import { reactive, ref } from 'vue'
  import { userService } from '@/service/user'

  const { projects } = defineProps<{ projects: any }>()
  const { isAdmin } = storeToRefs(useAuthStore())

  const isDialog = ref(false)
  const users = ref()

  const initForm = Object.freeze({
    name: '',
    user: '',
    description: '',
    deviceId: NaN,
  })

  const form = reactive({ ...initForm })

  const handleDialog = () => {
    isDialog.value = !isDialog.value
  }

  const handleEdit = () => {}
  const handleDelete = () => {}
  const handleDetail = () => {}

  const handleCreate = async () => {
    const { items } = await userService.getAllUser()

    users.value = items

    handleDialog()
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
          <InputText id="name" v-model="form.name" />
          <label for="name">Name of Project</label>
        </IftaLabel>

        <IftaLabel>
          <!-- <Select
            v-model="form.user"
            inputId="id"
            :options="users"
            :multiple="true"
            optionLabel="name"
            class="w-full"
            variant="filled"
            id
          /> -->

          <MultiSelect
            v-model="form.user"
            display="comma"
            :options="users"
            optionLabel="name"
            filter
            inputId="id"
            class="w-full"
            id="user"
          />
          <label for="user">Select User to Project</label>
        </IftaLabel>

        <Button
          class="w-28"
          label="Add Device"
          text
          outlined
          severity="info"
          @click="handleCreate"
        />

        <IftaLabel>
          <Textarea id="desctiption" v-model="form.description" rows="5" cols="30" />
          <label for="desctiption">Description</label>
        </IftaLabel>

        <!-- button accept or cancel -->
        <div class="flex justify-end">
          <Button class="w-28" label="Cancel" text outlined severity="info" @click="handleCreate" />
          <Button class="w-28" label="Submit" text outlined severity="info" @click="handleCreate" />
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
    }
  }
</style>
