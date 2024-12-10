<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { authService } from '@/service/auth'
  import { ElMessage } from 'element-plus'
  import { useAuthStore } from '@/stores/auth'
  import BaseIcon from '@/component/BaseIcon.vue'

  const router = useRouter()
  const { setProfile } = useAuthStore()

  const isLogin = ref(true)

  const formLogin = reactive({
    username: '',
    password: '',
  })

  const formRegister = reactive({
    name: '',
    email: '',
    telephone: '',
    password: '',
  })

  const onSubmit = async () => {
    if (isLogin.value) {
      const res = await authService.login(formLogin)
      if (!res) return

      const { profile } = await authService.getProfile()
      if (!profile) return

      setProfile(profile)

      ElMessage({ message: 'Đăng nhập thành công', type: 'success' })

      router.push({ name: 'alert' })

      return
    }

    const res = await authService.registryUser(formRegister)
    if (!res) return

    ElMessage({ message: 'Đăng ký thành công', type: 'success' })

    isLogin.value = true

    Object.keys(formRegister).forEach((key) => {
      formRegister[key] = ''
    })

    Object.keys(formLogin).forEach((key) => {
      formLogin[key] = ''
    })
  }
</script>

<template>
  <div class="login-page w-full h-[100vh] flex justify-center items-center">
    <Card
      :style="{ width: '45rem', height: isLogin ? '18rem' : '25rem', overflow: 'hidden' }"
      class="relative"
    >
      <template #title>
        <span>{{ isLogin ? 'Sign In' : 'Sign Up' }}</span>
      </template>
      <template #subtitle> to continue to Aiot Platform </template>
      <template #content>
        <div class="content flex gap-8">
          <div class="w-1/2 flex justify-center items-center">
            <BaseIcon name="aiot" size="150" />
          </div>

          <!-- Login -->
          <div v-if="isLogin" class="w-1/2 h-full flex flex-col gap-6 justify-center">
            <FloatLabel variant="on" security="info" class="w-full">
              <InputText id="username" v-model="formLogin.username" class="w-full" />
              <label for="username">Username</label>
            </FloatLabel>

            <FloatLabel variant="on" security="info">
              <Password
                v-model="formLogin.password"
                id="password"
                name="password"
                placeholder="Password"
                fluid
                :feedback="false"
                toggleMask
                class="password w-full"
              />
              <label for="password">Password</label>
            </FloatLabel>
          </div>

          <!-- Register -->
          <div v-else class="w-1/2 h-full flex flex-col gap-4">
            <FloatLabel variant="on" security="info" class="w-full">
              <InputText id="name" v-model="formRegister.name" class="w-full" />
              <label for="name">Name</label>
            </FloatLabel>

            <FloatLabel variant="on" security="info">
              <InputText id="email" v-model="formRegister.email" class="w-full" />
              <label for="email">Email</label>
            </FloatLabel>

            <FloatLabel variant="on" security="info" class="w-full">
              <InputText id="telephone" v-model="formRegister.telephone" class="w-full" />
              <label for="telephone">Telephone</label>
            </FloatLabel>

            <FloatLabel variant="on" security="info" class="w-full">
              <Password
                v-model="formLogin.password"
                id="password"
                name="password"
                placeholder="Password"
                :feedback="false"
                toggleMask
                class="password w-full"
              />
              <label for="password">Password</label>
            </FloatLabel>
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex gap-5 absolute bottom-3 right-5">
          <Button label="Forgot Password ?" variant="text" />

          <Button
            :label="isLogin ? 'Register ?' : ' Login ?'"
            severity="secondary"
            outlined
            @click="isLogin = !isLogin"
          />
          <Button :label="isLogin ? 'Sign' : 'Sign Up'" severity="info" @click="onSubmit" />
        </div>
      </template>
    </Card>
  </div>
</template>

<style lang="scss">
  .login-page {
    background-color: #f0f4f9;
  }
  .password {
    .p-inputtext.p-component.p-password-input {
      width: 100%;
    }
  }
</style>
