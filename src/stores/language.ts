import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export const useLanguageStore = defineStore('language', () => {
  // 檢查是否在瀏覽器環境
  const isBrowser = typeof window !== 'undefined'

  // State
  const currentLocale = ref<string>(
    isBrowser && localStorage.getItem('language') ? localStorage.getItem('language')! : 'zh-TW'
  )

  // Actions
  function switchLanguage(locale: string) {
    currentLocale.value = locale

    if (isBrowser) {
      localStorage.setItem('language', locale)
      // 更新 HTML lang 屬性
      document.documentElement.lang = locale === 'zh-TW' ? 'zh-TW' : 'en'
    }
  }

  function toggleLanguage() {
    const newLocale = currentLocale.value === 'zh-TW' ? 'en' : 'zh-TW'
    switchLanguage(newLocale)
  }

  function getLanguageButtonText() {
    return currentLocale.value === 'zh-TW' ? 'EN' : '中'
  }

  return {
    currentLocale,
    switchLanguage,
    toggleLanguage,
    getLanguageButtonText
  }
})
