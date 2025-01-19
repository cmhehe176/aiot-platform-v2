<script lang="ts" setup>
  const emit = defineEmits(['logout'])
</script>

<template>
  <div class="header h-[70px] w-full p-2 flex justify-between bg-slate-400">
    <span class="title w-40 flex justify-center items-center">Aiot Platform</span>
    <Button severity="secondary" @click="emit('logout')">Logout</Button>
  </div>
</template>

<style lang="scss" scoped>
  .title {
    font-size: larger;
    font-weight: 500;
    color: white;
  }
</style>
