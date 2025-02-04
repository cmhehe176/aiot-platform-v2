<script lang="ts" setup>
  import { ref } from 'vue'
  import CreateSupport from '../CreateSupport.vue'
  import BaseIcon from '../BaseIcon.vue'
  import { useAuthStore } from '@/stores/auth'

  const { profile } = useAuthStore()

  const emit = defineEmits(['logout'])
  const isDialog = ref(false)
</script>

<template>
  <div class="header h-[70px] w-full p-2 flex justify-between bg-slate-400">
    <span class="title w-40 flex justify-center items-center">Aiot Platform</span>

    <!-- <div @click="() => (isDialog = !isDialog)">hello</div>

    <Button severity="secondary" @click="emit('logout')">Logout</Button>
   -->

    <span class="profile"> Hello {{ profile.name }} ! </span>
    <el-dropdown class="items-center mr-7" placement="bottom" trigger="click">
      <el-button> <BaseIcon name="cloud" size="30" /></el-button>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="() => (isDialog = !isDialog)">
            <div class="flex gap-2">
              <BaseIcon name="send" size="20" />
              <span>Support</span>
            </div>
          </el-dropdown-item>

          <el-dropdown-item @click="emit('logout')">
            <div class="flex gap-2">
              <BaseIcon name="logout" size="20" />
              <span>Logout</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

  <CreateSupport v-model="isDialog" />
</template>

<style lang="scss">
  .title {
    font-size: larger;
    font-weight: 500;
    color: white;
  }

  .el-dropdown {
    button {
      height: 50px;
    }
  }
  .profile {
    align-items: center;
    color: white;
  }
</style>
