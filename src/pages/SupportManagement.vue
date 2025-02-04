<script lang="ts" setup>
  import { supportService } from '@/service/support'
  import { onMounted, reactive, ref } from 'vue'
  import { formatDate } from '@/utils/dayjs'
  import { emitter } from '@/utils/mitt'

  const supportList = ref([])
  const isDialog = ref(false)
  const currentData = ref()
  const replied = ref('')

  const handleReplied = (data) => {
    isDialog.value = true
    currentData.value = data
  }

  const handleCloseDialog = () => {
    isDialog.value = false
    currentData.value = undefined
  }

  const handleSubmit = async () => {
    await supportService.reply({ id: currentData.value.id, params: { reply: replied.value } })
    handleCloseDialog()
  }

  const handleFetchApi = async () => {
    supportList.value = await supportService.getList()
  }

  emitter.on('supportCreated', async () => await handleFetchApi())

  onMounted(async () => await handleFetchApi())
</script>

<template>
  <div class="list-device">
    <DataTable :value="supportList" tableStyle="min-width: 5rem">
      <template #header>
        <span class="text-xl font-bold ml-8">Feedback and Support</span>
      </template>

      <Column header="Status" class="status flex justify-center">
        <template #body="{ data }">
          <ToggleButton
            v-model="data.isReplied"
            onLabel="Replied"
            offLabel="Not Replied"
            class="w-36"
            readonly
            @click.prevent="handleReplied(data)"
          />
        </template>
      </Column>

      <Column field="id" header="Id"></Column>
      <Column field="title" header="Title"></Column>
      <Column field="user.name" header="User"></Column>
      <Column field="user.email" header="Email"></Column>

      <Column header="Created At">
        <template #body="{ data }">{{ formatDate(data.createdAt) }}</template>
      </Column>

      <Column header="Replied At">
        <template #body="{ data }">
          <span v-if="data.isReplied">{{ formatDate(data.updatedAt) }}</span>
        </template>
      </Column>

      <Column header="Admin Response">
        <template #body="{ data }">
          <span v-if="data.isReplied">{{ data.admin?.name }}</span>
        </template>
      </Column>
    </DataTable>

    <!-- Replied -->
    <Dialog
      v-model:visible="isDialog"
      class="edit-project"
      modal
      position="top"
      header="Reply Support"
      :style="{ width: '70vh' }"
      v-on:after-hide="handleCloseDialog"
    >
      <div class="flex flex-col gap-[35px]">
        <div class="flex gap-2">
          <span class="font-bold">Title: </span>
          <span>{{ currentData.title }}</span>
        </div>

        <div class="flex gap-2">
          <span class="font-bold">User: </span>
          <span>{{ currentData.user?.name }} - {{ currentData.user?.email }}</span>
        </div>

        <div v-if="currentData.isReplied" class="flex gap-2">
          <span class="font-bold">Replied by: </span>
          <span>{{ currentData.admin.name }}</span>
        </div>

        <div class="flex gap-2">
          <span class="font-bold">Issue: </span>
          <span>{{ currentData.description }}</span>
        </div>

        <IftaLabel v-if="!currentData.isReplied">
          <Textarea id="reply" v-model="replied" rows="5" cols="30" />
          <label for="reply">Reply</label>
        </IftaLabel>

        <div v-else class="flex gap-2">
          <span class="font-bold">Replied: </span>
          <span v-html="currentData.reply"></span>
        </div>

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
            v-if="!currentData.isReplied"
            class="w-28"
            label="Submit"
            text
            outlined
            severity="info"
            @click="handleSubmit"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>
