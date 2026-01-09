// CSS 引入順序：變數 → 基礎 → 組件 → 效果 → 無障礙 → 列印
import './styles/variables.css'
import './styles/base.css'
import './styles/components/navigation.css'
import './styles/components/hero.css'
import './styles/components/about.css'
import './styles/components/timeline.css'
import './styles/components/projects.css'
import './styles/components/contact.css'
import './styles/components/contact-form.css'
import './styles/components/modal.css'
import './styles/cursor.css'
import './styles/accessibility.css'
import './styles/lazy-load.css'
import './styles/print.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app')

// 註冊 PWA Service Worker
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // 當有新版本可用時，可以選擇顯示提示訊息
    if (confirm('新版本可用！點擊確定以更新。')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App ready to work offline')
  },
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    // Service Worker 註冊成功
    console.log('Service Worker registered:', registration)
  },
  onRegisterError(error: Error) {
    console.error('Service Worker registration failed:', error)
  },
})
