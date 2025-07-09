import { createApp } from 'vue'
import App from './App.vue'
import { createVuetify } from 'vuetify'
import { es } from 'vuetify/locale'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from '@/router'
import { useStore } from '@/store'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)

const store = useStore()

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: store.conf.theme_dark ? 'dark' : 'light',
  },
  locale: {
    locale: 'es',
    fallback: 'es',
    messages: { es },
  },
})

app.config.productionTip = false
app.config.globalProperties.$window = window

app.use(vuetify)
app.use(router)
app.mount('#app')