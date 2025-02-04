<script lang="ts" setup>
  import { supportService } from '@/service/support'
  import { computed, reactive, ref } from 'vue'
  import { emitter } from '@/utils/mitt'

  const isDialog = defineModel({ default: false })

  const form = reactive({ title: '', description: '' })

  const checkSubmit = computed(() => !Object.values(form).every((value) => !!value))

  const handleCloseDialog = () => {
    isDialog.value = false
    Object.assign(form, { title: '', description: '' })
  }

  const handleSubmit = async () => {
    await supportService.create(form)
    handleCloseDialog()

    emitter.emit('supportCreated')
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
      <IftaLabel>
        <InputText id="title" v-model="form.title" />
        <label for="title">Title</label>
      </IftaLabel>

      <IftaLabel>
        <Textarea id="description" v-model="form.description" rows="5" cols="30" />
        <label for="description">Description</label>
      </IftaLabel>

      <!-- button accept or cancel -->
      <div class="flex justify-end">
        <Button
          class="w-28"
          label="Cancel"
          text
          outlined
          severity="secondary"
          @click="handleCloseDialog"
        />

        <Button
          class="w-28"
          label="Submit"
          text
          outlined
          severity="info"
          @click="handleSubmit"
          :disabled="checkSubmit"
        />
      </div>
    </div>
  </Dialog>
</template>

<style lang="scss" scoped></style>
