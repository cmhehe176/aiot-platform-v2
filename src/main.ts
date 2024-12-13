import './assets/css/main.scss'
import 'leaflet/dist/leaflet.css'
import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vClickOutside from 'click-outside-vue3'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { resetStore } from '@/stores/resetStore'
import App from './App.vue'
import router from './router'
import socketPlugin from '@/plugin/socket'

const app = createApp(App)
const pinia = createPinia()

pinia.use(resetStore)

app.use(pinia)
app.use(router)
app.use(vClickOutside)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      prefix: 'p',
      darkModeSelector: 'no',
      cssLayer: false,
    },
  },
})

app.use(socketPlugin, `${import.meta.env.VITE_END_POINT}/socket`)

app.mount('#app')
