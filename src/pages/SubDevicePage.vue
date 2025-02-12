<script lang="ts" setup>
  import { deviceService } from '@/service/device'
  import { onMounted, reactive, ref, watch } from 'vue'
  import { formatDate } from '@/utils/dayjs'
  import { storeToRefs } from 'pinia'
  import { useAuthStore } from '@/stores/auth'
  import { userService } from '@/service/user'
  import { ElNotification } from 'element-plus'
  import SelectArea from '@/component/SelectArea.vue'

  const authStore = useAuthStore()
  const { isAdmin } = storeToRefs(authStore)

  const listSubDevice = ref()
  const isDialog = ref(false)
  const subDeviceData = ref<any>()
  const listUser = ref()

  const initForm = {
    type: 'sensor',
    permissions: [],
    lower_limit: '',
    upper_limit: '',
    selected_area: [],
    detection_timer: '',
  }

  const form = reactive({ ...initForm })

  const handleSetting = async (data) => {
    subDeviceData.value = undefined
    Object.assign(form, initForm)

    isDialog.value = !isDialog.value
    subDeviceData.value = data

    form.type = data.type
    form.lower_limit = data.lower_limit
    form.upper_limit = data.upper_limit
    form.detection_timer = data.detection_timer
    form.selected_area = data.selected_area ? JSON.parse(data.selected_area) : []

    if (data.permissions && Array.isArray(data.permissions)) {
      form.permissions = data.permissions
    }
  }

  const handleSave = async () => {
    if (!subDeviceData.value && !subDeviceData.value.id) return

    Object.entries(form).forEach(([key, value]) => {
      if (!value || (Array.isArray(value) && !value.length)) delete form[key]
    })

    if (!Object.keys(form).length) {
      isDialog.value = false

      return
    }

    const affected = await deviceService.updateSubDevice(subDeviceData.value.id, form)

    ElNotification({
      title: affected ? 'Save Sub Device Successfull' : 'Has Error in Save',
      message: affected ? 'Successfull' : `Device isn't Active`,
      type: affected ? 'success' : 'error',
      duration: 1000,
    })

    if (affected) isDialog.value = false

    listSubDevice.value = await deviceService.getListSubDevice()
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

      <Column field="id" header="Id"></Column>

      <Column field="name" header="Name"></Column>

      <Column field="type" header="Type"></Column>

      <Column field="unit" header="Unit"></Column>

      <Column field="device" header="Device">
        <template #body="{ data }"> {{ data.device?.name }}</template>
      </Column>

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
      :header="`Setting Sub-Device ${subDeviceData?.name}`"
      :style="{ width: '40rem' }"
      position="top"
    >
      <div v-if="subDeviceData">
        <div class="flex flex-col gap-2" v-if="subDeviceData.type === 'camera'">
          <FloatLabel variant="in">
            <InputText
              id="detection_timer"
              type="text"
              v-model="form.detection_timer"
              class="w-full"
            />

            <label for="detection_timer">Setting detection timer</label>
          </FloatLabel>

          <span class="font-bold">Select area for camera AI detect</span>
          <SelectArea v-model="form.selected_area" :initialHull="form.selected_area || []" />
        </div>

        <div v-if="subDeviceData.type === 'sensor'" class="flex flex-col gap-7">
          <FloatLabel variant="in">
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
            <InputText
              id="input_lower_setting"
              type="text"
              v-model="form.lower_limit"
              class="w-full"
            />

            <label for="input_lower_setting">Setting lower limit Sub Device</label>
          </FloatLabel>

          <FloatLabel variant="in">
            <InputText
              id="input_upper_setting"
              type="text"
              v-model="form.upper_limit"
              class="w-full"
            />

            <label for="input_upper_setting">Setting upper limit Sub Device</label>
          </FloatLabel>
        </div>
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
