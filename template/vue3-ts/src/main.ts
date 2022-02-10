import { createApp } from 'vue'
import App from './App.vue'
import axios from '@/utils/request'
import router from './router'
import { createPinia } from 'pinia'

const app = createApp(App)

app.config.globalProperties.$http = axios
app.use(router)
app.use(createPinia())
app.mount('#app')
