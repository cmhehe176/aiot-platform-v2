<script lang="ts" setup>
  import { formatDate } from '@/utils/dayjs'
  import { computed, ref } from 'vue'
  import type { NotificationMessage } from './type'
  import BaseIcon from '../BaseIcon.vue'
  import { nominatimService } from '@/service/nominatim'
import { ElNotification } from 'element-plus'

  const { alert } = defineProps<{ alert: NotificationMessage }>()

  const date = computed<any>(() => formatDate(alert.timestamp) || 'inValid Time')
  const displayLocation = ref()

  const emit = defineEmits(['detail', 'reject', 'accept'])

  const getPreviewNotification = async () => {
    const location = await nominatimService.fetchApiAddress(alert.location.lat, alert.location.lon)

    if (!location) return
    displayLocation.value = location.display_name.split(',').slice(0, -2).join(', ')

    ElNotification({
      title: 'Get Location',
      message: 'Success',
      type: 'success',
      duration: 1000,
    })
  }
</script>

<template>
  <Fieldset :legend="date">
    <div class="flex justify-between">
      <div>
        <div class="p-1"><span class="font-bold"> Device :</span> {{ alert.device.name }}</div>

        <div class="p-1">
          <span class="font-bold"> Status :</span>
          {{ alert.device.isActive ? 'Active' : 'InActive' }}
        </div>

        <div class="p-1"><span class="font-bold"> Payload : </span> {{ alert.payload }}</div>
      </div>

      <div class="items-center" v-if="displayLocation">
        <BaseIcon name="marker" size="20" /> {{ displayLocation }}
      </div>

      <div class="flex gap-2 flex-wrap items-center">
        <BaseIcon name="marker" size="40" @click="getPreviewNotification" />

        <Button variant="text" class="text-xl font-bold" severity="text" @click="emit('detail')">
          Detail
        </Button>

        <Button
          variant="outlined"
          class="text-xl font-bold"
          severity="danger"
          @click="emit('reject')"
        >
          Reject
        </Button>

        <Button
          variant="outlined"
          class="text-xl font-bold"
          severity="info"
          @click="emit('accept')"
        >
          Accept
        </Button>
      </div>
    </div>
  </Fieldset>
</template>

<style lang="scss" scoped></style>
