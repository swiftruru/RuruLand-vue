// CSS 引入順序：變數 → 基礎 → 組件 → 效果 → 無障礙
import './styles/variables.css'
import './styles/base.css'
import './styles/components/navigation.css'
import './styles/components/hero.css'
import './styles/components/about.css'
import './styles/components/projects.css'
import './styles/components/contact.css'
import './styles/components/modal.css'
import './styles/cursor.css'
import './styles/accessibility.css'

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
