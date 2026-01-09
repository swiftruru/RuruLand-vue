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
import './styles/components/reading-progress.css'
import './styles/cursor.css'
import './styles/animations.css'
import './styles/accessibility.css'
import './styles/lazy-load.css'
import './styles/print.css'

import { ViteSSG } from 'vite-ssg'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'

import App from './App.vue'
import { i18n } from './i18n'

// https://github.com/antfu/vite-ssg
export const createApp = ViteSSG(
  App,
  {
    routes: [
      { path: '/', component: () => import('./views/HomeView.vue') }
    ]
  },
  (ctx) => {
    // 安裝 plugins
    ctx.app.use(createPinia())
    ctx.app.use(createHead())
    ctx.app.use(i18n)
  },
)

// 客戶端專用：PWA Service Worker
if (typeof window !== 'undefined') {
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm('新版本可用！點擊確定以更新。')) {
          updateSW(true)
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline')
      },
      onRegistered(registration: ServiceWorkerRegistration | undefined) {
        console.log('Service Worker registered:', registration)
      },
      onRegisterError(error: Error) {
        console.error('Service Worker registration failed:', error)
      },
    })
  })
}
