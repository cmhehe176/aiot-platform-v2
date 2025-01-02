<script lang="ts" setup>
  import { deviceService } from '@/service/device'
  import { onMounted, reactive, ref } from 'vue'
  import { formatDate } from '@/utils/dayjs'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { userService } from '@/service/user'
  import { ElNotification } from 'element-plus'

  const authStore = useAuthStore()
  const { isAdmin } = storeToRefs(authStore)

  const listSubDevice = ref()
  const isDialog = ref(false)
  const subDeviceData = ref<any>()
  const listUser = ref()

  const initForm = {
    state: '',
    permissions: [],
    setting: '',
  }

  const form = reactive({ ...initForm })

  const handleSetting = async (data) => {
    subDeviceData.value = undefined
    Object.assign(form, initForm)

    isDialog.value = !isDialog.value
    subDeviceData.value = data
    form.state = data.type

    if (data.permissions && Array.isArray(data.permissions)) {
      form.permissions = data.permissions
    }
  }

  const handleSave = async () => {
    if (!subDeviceData.value && !subDeviceData.value.id) return
    //update in future
    delete form.state
    delete form.setting

    const affected = await deviceService.updateSubDevice(subDeviceData.value.id, form)

    ElNotification({
      title: affected ? 'Save Sub Device Successfull' : 'Has Error In save Sub Device',
      message: affected ? 'Successfull' : 'Error',
      type: affected ? 'success' : 'error',
      duration: 1000,
    })

    if (affected) isDialog.value = false
  }

  onMounted(async () => {
    listSubDevice.value = await deviceService.getListSubDevice()
    listUser.value = await userService.getAllUser()
  })
</script>

<template>
  <div class="list-sub-device">
    <DataTable :value="listSubDevice" tableStyle="min-width: 5rem">
      <template #header>
        <span class="text-xl font-bold ml-8">Sub Devices</span>
      </template>

      <!-- <Column header="Status" class="status flex justify-center">
        <template #body="{ data }">
          <ToggleButton
            v-model="data.isActive"
            onLabel="Active"
            offLabel="InActive"
            class="w-36"
            disabled
          />
        </template>
      </Column> -->

      <Column field="id" header="Id"></Column>

      <Column field="name" header="Name"></Column>

      <Column field="type" header="Type"></Column>

      <Column header="CreatedAt">
        <template #body="{ data }"> {{ formatDate(data.createdAt) }}</template>
      </Column>

      <Column header="UpdatedAt">
        <template #body="{ data }"> {{ formatDate(data.updatedAt) }}</template>
      </Column>

      <Column v-if="isAdmin" header="Action">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button label="Setting" outlined severity="secondary" @click="handleSetting(data)" />

            <!-- <Button
              label="Delete"
              hidden
              outlined
              severity="danger"
            /> -->
          </div>
        </template>
      </Column>
    </DataTable>

    <Dialog
      v-model:visible="isDialog"
      modal
      header="Setting Device"
      :style="{ width: '35rem' }"
      position="top"
    >
      <div v-if="subDeviceData" class="flex flex-col gap-7">
        <FloatLabel variant="in" v-if="subDeviceData.type === 'sensor'">
          <MultiSelect
            v-model="form.permissions"
            :options="listUser"
            id="select_user"
            optionLabel="name"
            option-value="id"
            filter
            checkmark
            class="w-full"
          />
          <label for="select_user">Select a User for access to Sub Device</label>
        </FloatLabel>

        <FloatLabel variant="in">
          <InputText id="input_setting" type="text" v-model="form.setting" class="w-full" />

          <label for="input_setting">Setting limit Sub Device</label>
        </FloatLabel>

        <!-- <FloatLabel variant="on">
          <InputText id="on_label" v-model="value2" autocomplete="off" />
          <label for="on_label">On Label</label>
        </FloatLabel> -->
      </div>

      <div class="flex gap-1 mt-7 flex-row-reverse">
        <Button label="Save" outlined severity="info" @click="handleSave" />

        <!-- <Button
              label="Delete"
              hidden
              outlined
              severity="danger"
            /> -->
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped></style>
