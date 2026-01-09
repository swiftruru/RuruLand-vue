import { describe, it, expect, beforeEach } from 'vitest'
import { useLanguage } from '../../composables/useLanguage'

describe('useLanguage', () => {
  beforeEach(() => {
    // 重置 localStorage
    localStorage.clear()
  })

  it('should initialize with default language from localStorage', () => {
    localStorage.setItem('language', 'en')
    const { currentLanguage } = useLanguage()
    expect(currentLanguage.value).toBe('en')
  })

  it('should initialize with zh-TW when no language in localStorage', () => {
    const { currentLanguage } = useLanguage()
    expect(currentLanguage.value).toBe('zh-TW')
  })

  it('should toggle language between zh-TW and en', () => {
    const { currentLanguage, toggleLanguage } = useLanguage()

    expect(currentLanguage.value).toBe('zh-TW')

    toggleLanguage()
    expect(currentLanguage.value).toBe('en')

    toggleLanguage()
    expect(currentLanguage.value).toBe('zh-TW')
  })

  it('should save language to localStorage when toggled', () => {
    const { toggleLanguage } = useLanguage()

    toggleLanguage()
    expect(localStorage.getItem('language')).toBe('en')

    toggleLanguage()
    expect(localStorage.getItem('language')).toBe('zh-TW')
  })

  it('should provide languageButtonText based on current language', () => {
    const { currentLanguage, languageButtonText } = useLanguage()

    expect(languageButtonText.value).toBe('EN')

    currentLanguage.value = 'en'
    expect(languageButtonText.value).toBe('中文')
  })

  it('should provide t function from i18n', () => {
    const { t } = useLanguage()
    expect(typeof t).toBe('function')
  })
})
