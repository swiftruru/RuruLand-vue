import { createI18n } from 'vue-i18n'

// 導入翻譯文件
const localeFiles = import.meta.glob<{ default: any }>('./locales/*/*.json', { eager: true })

// 建立語言訊息物件
const messages: Record<string, any> = {}

Object.entries(localeFiles).forEach(([key, value]) => {
  const locale = key.match(/\.\/locales\/(.+?)\//)?.[1]
  const module = key.match(/\/([^/]+)\.json$/)?.[1]

  if (locale && module) {
    if (!messages[locale]) {
      messages[locale] = {}
    }
    messages[locale][module] = value.default
  }
})

// 檢查是否在瀏覽器環境
const getDefaultLocale = () => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem('language') || 'zh-TW'
  }
  return 'zh-TW'
}

export const i18n = createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'zh-TW',
  messages,
  globalInjection: true
})
