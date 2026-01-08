/**
 * 語言切換 Composable
 * 處理所有語言相關的邏輯
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useLanguageStore } from '../stores/language'

export function useLanguage() {
  const { t, locale } = useI18n()
  const languageStore = useLanguageStore()

  /**
   * 獲取語言按鈕顯示文字
   */
  const languageButtonText = computed(() => {
    return locale.value === 'zh-TW' ? 'English' : '正體中文'
  })

  /**
   * 切換語言
   */
  function toggleLanguage() {
    const newLocale = locale.value === 'zh-TW' ? 'en' : 'zh-TW'
    locale.value = newLocale
    languageStore.switchLanguage(newLocale)
  }

  /**
   * 設定特定語言
   */
  function setLanguage(lang: 'zh-TW' | 'en') {
    locale.value = lang
    languageStore.switchLanguage(lang)
  }

  return {
    t,
    locale,
    languageButtonText,
    toggleLanguage,
    setLanguage
  }
}
