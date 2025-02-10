import { createRouter, createWebHistory } from 'vue-router'
import Index from './pages/index.vue'
import ChartPage from './pages/ChartPage.vue'
import AlertPage from './pages/AlertPage.vue'
import ProjectManagement from './pages/ProjectManagement.vue'
import MyProject from './pages/MyProject.vue'
import SupportManagement from './pages/SupportManagement.vue'
import LoginPage from './pages/LoginPage.vue'
import DefaultLayout from './layout/DefaultLayout.vue'
import { useAuthStore } from './stores/auth'
import { authService } from './service/auth'
import DevicePage from './pages/DevicePage.vue'
import { useLoadingStore } from './stores/loading'
import SubDevicePage from './pages/SubDevicePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { layout: DefaultLayout },
    },
    {
      path: '/dashboard',
      children: [
        {
          path: '/alert',
          name: 'alert',
          component: AlertPage,
        },
        {
          path: '/chart',
          name: 'chart',
          component: ChartPage,
        },
      ],
    },

    {
      path: '/',
      children: [
        {
          path: '/device',
          name: 'device',
          component: DevicePage,
        },
        {
          path: '/sub-device',
          name: 'sub-device',
          component: SubDevicePage,
        },
      ],
    },
    {
      path: '/my-project',
      name: 'myproject',
      component: MyProject,
    },
    {
      path: '/support-management',
      name: 'support',
      component: SupportManagement,
    },
  ],
})

const PUBLIC_PAGES = ['/login']

router.beforeEach(async (to, _from, next) => {
  const { setProfile, profile } = useAuthStore()

  if (PUBLIC_PAGES.includes(to.path)) {
    return next()
  }

  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) return next('/login')

  if (profile) return next()

  const userProfile = await authService.getProfile()

  if (!userProfile.profile) return next('/login')

  setProfile(userProfile.profile)

  next()
})

router.afterEach(() => useLoadingStore().clearLoading())
export default router
