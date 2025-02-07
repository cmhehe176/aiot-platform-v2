<script lang="ts" setup>
  const isDialog = defineModel({ default: false })
  const { sensorData } = defineProps<{ sensorData: any }>()

  const handleCloseDialog = () => {
    isDialog.value = false
  }
</script>

<template>
  <Dialog
    v-model:visible="isDialog"
    class="edit-project"
    modal
    position="top"
    header="Send Support"
    :style="{ width: '70vh' }"
    v-on:after-hide="handleCloseDialog"
  >
    <div class="flex flex-col gap-[35px]">
      <div class="flex gap-2 flex-col">
        <h1>Device Information :</h1>

        <div class="ml-5">
          <p><strong>Name:</strong> {{ sensorData?.device.name }}</p>
          <p><strong>Description:</strong> {{ sensorData?.device.data.description }}</p>
          <p><strong>MAC Address:</strong> {{ sensorData?.device.mac_address }}</p>
          <p>
            <strong>Active Status:</strong>
            {{ sensorData?.device.isActive ? 'Active' : 'Inactive' }}
          </p>
        </div>

        <h2>Location :</h2>

        <div class="ml-5">
          <p><strong>Latitude:</strong> {{ sensorData?.location.lat }}</p>
          <p><strong>Longitude:</strong> {{ sensorData?.location.lon }}</p>
          <p><strong>Altitude:</strong> {{ sensorData?.location.alt }}m</p>
        </div>

        <h2>Sensor Data :</h2>

        <ul class="ml-5">
          <li v-for="sensor in sensorData?.sensor_list" :key="sensor.id">
            <strong>{{ sensor.name }}:</strong> {{ sensor.payload }} {{ sensor.unit }}
          </li>
        </ul>
      </div>
      <div class="flex justify-end">
        <Button
          class="w-28"
          label="Cancel"
          text
          outlined
          severity="secondary"
          @click="handleCloseDialog"
        />
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped></style>
