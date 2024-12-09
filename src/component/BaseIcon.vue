<script lang="ts" setup>
  import { onMounted, ref } from 'vue'

  const imageSrc = ref('')

  const { name, size = 20 } = defineProps<{ name: string; size: string | number }>()

  onMounted(async () => {
    const imageModule = await import(`@/assets/icon/${name}.svg`)
    imageSrc.value = imageModule.default
  })
</script>

<template>
  <img
    :src="imageSrc"
    alt="BaseIcon"
    :style="{ width: `${size}px`, height: `${size}px` }"
    class="cursor-pointer"
  />
</template>
