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
      {{ sensorData }}

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
