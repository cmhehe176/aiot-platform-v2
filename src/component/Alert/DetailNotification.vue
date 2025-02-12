<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import videojs from 'video.js'
  import LeafletMap from '../LeafletMap.vue'

  const isDialog = defineModel({ default: false })
  const isDialogPreview = ref(false)
  const videoUrl = ref<any>(null)

  const { notificationData } = defineProps<{ notificationData: any }>()

  const typeMessage = computed(() =>
    notificationData.external_messages.map((message) => message.type),
  )

  const objectData = computed(
    () => notificationData.message.filter((message) => message.type === 'object')[0],
  )

  const sensorData = computed(
    () => notificationData.message.filter((message) => message.type === 'sensor')[0],
  )

  const tab = ref('object')

  const handleCloseDialog = () => {
    isDialog.value = false
  }

  const videoPlayer = ref<HTMLVideoElement | null>(null)

  const handleViewVideo = (video: string) => {
    videoUrl.value = video

    isDialogPreview.value = true
  }

  onMounted(() => {
    if (!objectData.value) tab.value = 'sensor'

    if (videoPlayer.value) {
      videojs(videoPlayer.value, {
        controls: true,
        autoplay: false,
        preload: 'auto',
      })
    }
  })
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
      <div>
        <SelectButton v-model="tab" :options="typeMessage" />

        <div v-if="tab === 'object' && objectData">
          <div class="flex gap-2 flex-col">
            <h1>Device Information :</h1>

            <div class="ml-5">
              <p><strong>Name:</strong> {{ objectData?.device.name }}</p>
              <p><strong>Description:</strong> {{ objectData?.device.data.description }}</p>
              <p><strong>MAC Address:</strong> {{ objectData?.device.mac_address }}</p>
              <p>
                <strong>Active Status:</strong>
                {{ objectData?.device.isActive ? 'Active' : 'Inactive' }}
              </p>
            </div>

            <h2>Object :</h2>

            <div class="flex gap-20">
              <div v-for="preview in objectData.object_list" :key="preview.id">
                <Card style="width: 10rem; height: 12rem" class="object-card">
                  <template #content>
                    <div class="flex flex-col flex-wrap gap-4">
                      <Image :src="preview.image_URL" alt="Image Object" width="250" preview />

                      <div v-if="preview.video_URL" class="flex justify-center items-end h-1/4">
                        <Button
                          label="Video"
                          severity="secondary"
                          outlined
                          class="w-1/2"
                          @click="handleViewVideo(preview.video_URL)"
                        />
                      </div>
                    </div>
                  </template>
                </Card>
              </div>
            </div>
          </div>
        </div>

        <div v-if="tab === 'sensor' && sensorData">
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

            <h2>Sensor Data :</h2>

            <ul class="ml-5">
              <li v-for="sensor in sensorData?.sensor_list" :key="sensor.id">
                <strong>{{ sensor.name }}:</strong> {{ sensor.payload }} {{ sensor.unit }}
              </li>
            </ul>
          </div>
        </div>

        <Dialog
          v-model:visible="isDialogPreview"
          :style="{ width: '50rem', height: 'min-content' }"
        >
          <video ref="videoPlayer" class="video-js" controls preload="auto">
            <source :src="videoUrl" type="video/mp4" />
          </video>
        </Dialog>
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
