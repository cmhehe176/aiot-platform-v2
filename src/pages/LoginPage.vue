<script setup lang="ts">
  import { reactive, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { authService } from '@/service/auth'
  import { ElMessage, ElNotification } from 'element-plus'
  import { useAuthStore } from '@/stores/auth'
  import BaseIcon from '@/component/BaseIcon.vue'

  const router = useRouter()
  const { setProfile } = useAuthStore()

  const isLogin = ref(true)
  const loading = ref(false)

  const isDialog = ref(false)

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

  const formForgot = ref('')

  const onSubmit = async () => {
    loading.value = true

    if (isLogin.value) {
      const res = await authService.login(formLogin)
      if (!res) return

      const { profile } = await authService.getProfile()
      if (!profile) return

      setProfile(profile)

      ElMessage({ message: 'Đăng nhập thành công', type: 'success' })

      router.push({ name: 'alert' })

      loading.value = false
      return
    }

    const res = await authService.registryUser(formRegister)

    if (!res) {
      ElNotification({
        title: 'Đăng ký thất bại',
        message: 'Hãy thử lại Email hoặc số điện thoại khác',
        type: 'error',
        duration: 3000,
      })

      loading.value = false

      return
    }

    ElNotification({
      title: 'Đăng ký thành công',
      message: 'Success',
      type: 'success',
      duration: 1000,
    })

    isLogin.value = true

    Object.keys(formRegister).forEach((key) => {
      formRegister[key] = ''
    })

    Object.keys(formLogin).forEach((key) => {
      formLogin[key] = ''
    })

    loading.value = false
  }

  const openForgorPass = async () => {
    isDialog.value = true
  }

  const submitForgotPass = async () => {
    loading.value = true

    try {
      await authService.forgotPass({ email: formForgot.value })

      isDialog.value = false

      ElNotification({
        title: 'Đã gửi Email xác nhận',
        message: 'Vui lòng check Mail',
        type: 'success',
        duration: 3000,
      })
    } catch (error) {
      ElNotification({
        title: 'Lấy lại mật khẩu thất bại',
        message: 'Hãy thử lại Email khác',
        type: 'error',
        duration: 3000,
      })
    } finally {
      loading.value = false
    }
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
          <Button label="Forgot Password ?" variant="text" @click="openForgorPass" />

          <Button
            :label="isLogin ? 'Register ?' : ' Login ?'"
            severity="secondary"
            outlined
            @click="isLogin = !isLogin"
          />

          <Button
            :label="isLogin ? 'Sign' : 'Sign Up'"
            :loading="loading"
            severity="info"
            @click="onSubmit"
          />
        </div>
      </template>
    </Card>
  </div>

  <Dialog
    v-model:visible="isDialog"
    class="edit-project"
    modal
    header="Forgot Password"
    :style="{ width: '50vh' }"
  >
    <div class="flex flex-col gap-[35px]">
      <IftaLabel>
        <InputText id="formForgot" v-model="formForgot" />
        <label for="formForgot">Email :</label>
      </IftaLabel>

      <!-- button accept or cancel -->
      <div class="flex justify-end">
        <Button
          class="w-28"
          label="Cancel"
          text
          outlined
          severity="secondary"
          @click="isDialog = !isDialog"
        />

        <Button
          class="w-28"
          label="Submit"
          text
          outlined
          :loading="loading"
          severity="info"
          @click="submitForgotPass"
        />
      </div>
    </div>
  </Dialog>
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
