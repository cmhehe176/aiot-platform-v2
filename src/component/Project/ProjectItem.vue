<script lang="ts" setup>
  import { useAuthStore } from '@/stores/auth'

  import BaseIcon from '../BaseIcon.vue'

  const { isAdmin } = useAuthStore()

  const { project } = defineProps<{ project: any }>()

  const emit = defineEmits(['edit', 'delete', 'detail', 'device'])
</script>

<template>
  <Card style="width: 15rem; height: 12rem" class="relative min-w-56">
    <template #title>
      <div class="flex justify-between">
        <span class="w-full cursor-pointer" @click="emit('device')">{{ project.name }}</span>
        <BaseIcon v-if="isAdmin" name="trash" size="20" @click="emit('delete', project.id)" />
      </div>
    </template>

    <template #content>
      <p class="content m-1 w-full h-18">
        {{ project.description }}
      </p>
    </template>

    <template #footer>
      <div class="flex gap-4 mt-2 absolute bottom-2 w-[85%]">
        <Button
          label="Detail"
          severity="secondary"
          outlined
          class="w-full"
          @click="emit('detail', project)"
        />
        <Button
          v-if="isAdmin"
          label="Edit"
          class="w-full"
          @click="emit('edit', project)"
          outlined
          severity="info"
        />
      </div>
    </template>
  </Card>
</template>

<style lang="scss" scoped>
  .content {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
