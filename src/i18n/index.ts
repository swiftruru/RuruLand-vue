import { createI18n } from 'vue-i18n'
import zhTW from '../locales/zh-TW'
import en from '../locales/en'

// 從 localStorage 獲取語言設定，預設為中文
// 使用 typeof 檢查避免 SSR 或建置時錯誤
let savedLocale = typeof window !== 'undefined'
  ? localStorage.getItem('language') || 'zh-TW'
  : 'zh-TW'

// 正規化 locale：將 'zh' 轉換為 'zh-TW'
if (savedLocale === 'zh') {
  savedLocale = 'zh-TW'
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', 'zh-TW')
  }
}

const i18n = createI18n({
  legacy: false, // 使用 Composition API 模式
  locale: savedLocale,
  fallbackLocale: 'zh-TW',
  messages: {
    'zh-TW': zhTW,
    'zh': zhTW, // 支援簡寫的 zh locale
    'en': en
  },
  globalInjection: true // 全域注入 $t
})

export default i18n
