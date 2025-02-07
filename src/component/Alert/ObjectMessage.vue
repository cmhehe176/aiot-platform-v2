<script lang="ts" setup>
  import { formatDate } from '@/utils/dayjs'
  import { computed, onMounted, ref } from 'vue'
  import type { ObjectMessage } from './type'
  import LeafletMap from '../LeafletMap.vue'
  import videojs from 'video.js'

  const emit = defineEmits(['reject', 'accept'])
  const { alert } = defineProps<{ alert: ObjectMessage }>()
  const isDialog = ref(false)
  const videoUrl = ref<any>(null)

  const date = computed<any>(
    () => formatDate(alert.timestamp, 'HH:mm:ss.SSS - DD/MM/YYYY') || 'inValid Time',
  )

  const handleViewVideo = (video: string) => {
    videoUrl.value = video

    isDialog.value = true
  }

  const videoPlayer = ref<HTMLVideoElement | null>(null)

  onMounted(() => {
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
  <div class="w-full">
    <Fieldset :legend="date">
      <div class="flex flex-col gap-1">
        <small>{{ alert.specs.description }}</small>

        <div class="flex gap-10 justify-between">
          <div class="flex flex-col gap-2">
            <div><span class="font-bold">Device :</span> {{ alert.device.name }}</div>

            <div>
              <span class="font-bold">Camera : </span>
              {{ alert.specs.camera.id }} - {{ alert.specs.camera.type }}
            </div>

            <div>
              <span class="font-bold">Status : </span>
              {{ alert.device.isActive ? 'Active' : 'InActive' }}
            </div>

            <div class="flex gap-8 mt-10">
              <Button
                variant="outlined"
                class="text-xl font-bold"
                severity="danger"
                @click="emit('reject', { id: alert.id, status: 2 })"
              >
                Reject
              </Button>

              <Button
                variant="outlined"
                class="text-xl font-bold"
                severity="info"
                @click="emit('accept', { id: alert.id, status: 1 })"
              >
                Accept
              </Button>
            </div>
          </div>

          <div class="flex gap-20">
            <div v-for="preview in alert.object_list" :key="preview.id">
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

          <LeafletMap
            :lat="alert.location.lat"
            :lng="alert.location.lon"
            :description="alert.location.description"
          />
        </div>
      </div>
    </Fieldset>

    <Dialog v-model:visible="isDialog" :style="{ width: '50rem', height: 'min-content' }">
      <video ref="videoPlayer" class="video-js" controls preload="auto">
        <source :src="videoUrl" type="video/mp4" />
      </video>
    </Dialog>
  </div>
</template>

<style lang="scss">
  .object-card {
    justify-content: center;
    .p-card-body {
      padding: 0;
    }
  }

  .video-js {
    width: 100%;
    height: 100%;
  }
</style>
