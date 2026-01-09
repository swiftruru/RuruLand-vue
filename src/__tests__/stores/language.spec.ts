import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useLanguageStore } from '../../stores/language'

describe('Language Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with default language zh-TW', () => {
    const store = useLanguageStore()
    expect(store.currentLocale).toBe('zh-TW')
  })

  it('should initialize with saved language from localStorage', () => {
    localStorage.setItem('language', 'en')
    setActivePinia(createPinia())
    const store = useLanguageStore()
    expect(store.currentLocale).toBe('en')
  })

  it('should switch language to en', () => {
    const store = useLanguageStore()
    expect(store.currentLocale).toBe('zh-TW')

    store.switchLanguage('en')
    expect(store.currentLocale).toBe('en')
  })

  it('should switch language to zh-TW', () => {
    localStorage.setItem('language', 'en')
    setActivePinia(createPinia())
    const store = useLanguageStore()
    expect(store.currentLocale).toBe('en')

    store.switchLanguage('zh-TW')
    expect(store.currentLocale).toBe('zh-TW')
  })

  it('should save language preference to localStorage', () => {
    const store = useLanguageStore()

    store.switchLanguage('en')
    expect(localStorage.getItem('language')).toBe('en')

    store.switchLanguage('zh-TW')
    expect(localStorage.getItem('language')).toBe('zh-TW')
  })

  it('should update document lang attribute when switching language', () => {
    const store = useLanguageStore()

    store.switchLanguage('en')
    expect(document.documentElement.lang).toBe('en')

    store.switchLanguage('zh-TW')
    expect(document.documentElement.lang).toBe('zh-TW')
  })

  it('should return correct language button text', () => {
    const store = useLanguageStore()

    expect(store.getLanguageButtonText()).toBe('EN')

    store.switchLanguage('en')
    expect(store.getLanguageButtonText()).toBe('中')
  })

  it('should toggle between languages', () => {
    const store = useLanguageStore()

    expect(store.currentLocale).toBe('zh-TW')

    store.toggleLanguage()
    expect(store.currentLocale).toBe('en')

    store.toggleLanguage()
    expect(store.currentLocale).toBe('zh-TW')
  })

  it('should persist language across store instances', () => {
    const store1 = useLanguageStore()
    store1.switchLanguage('en')

    // 創建新的 pinia 實例模擬重新載入
    setActivePinia(createPinia())
    const store2 = useLanguageStore()

    expect(store2.currentLocale).toBe('en')
  })

  it('should correctly set document lang attribute for different locales', () => {
    const store = useLanguageStore()

    store.switchLanguage('zh-TW')
    expect(document.documentElement.lang).toBe('zh-TW')

    store.switchLanguage('en')
    expect(document.documentElement.lang).toBe('en')
  })
})
