import { createI18n } from 'vue-i18n'
import zhTW from '../locales/zh-TW'
import en from '../locales/en'

// 從 localStorage 獲取語言設定，預設為中文
// 使用 typeof 檢查避免 SSR 或建置時錯誤
const savedLocale = typeof window !== 'undefined'
  ? localStorage.getItem('language') || 'zh-TW'
  : 'zh-TW'

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: savedLocale,
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTW,
    'en': en
  },
  globalInjection: true // 全域注入 $t
})

export default i18n
