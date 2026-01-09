import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { createI18n } from 'vue-i18n'
import { createPinia, setActivePinia } from 'pinia'
import { useLanguage } from '../../composables/useLanguage'
import { useLanguageStore } from '../../stores/language'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      test: '測試'
    },
    'en': {
      test: 'Test'
    }
  }
})

describe('useLanguage', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
    // 重置 i18n locale
    i18n.global.locale.value = 'zh-TW'
  })

  it('should initialize with default locale', () => {
    const TestComponent = defineComponent({
      setup() {
        return useLanguage()
      },
      template: '<div>{{ t("test") }}</div>'
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toBe('測試')
  })

  it('should toggle language from zh-TW to en', () => {
    const TestComponent = defineComponent({
      setup() {
        const { toggleLanguage, locale } = useLanguage()
        return { toggleLanguage, locale }
      },
      template: '<div>{{ locale }}</div>'
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    })

    const vm = wrapper.vm as any
    expect(vm.locale).toBe('zh-TW')

    vm.toggleLanguage()
    expect(vm.locale).toBe('en')
  })

  it('should toggle language from en to zh-TW', () => {
    i18n.global.locale.value = 'en'

    const TestComponent = defineComponent({
      setup() {
        const { toggleLanguage, locale } = useLanguage()
        return { toggleLanguage, locale }
      },
      template: '<div>{{ locale }}</div>'
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    })

    const vm = wrapper.vm as any
    expect(vm.locale).toBe('en')

    vm.toggleLanguage()
    expect(vm.locale).toBe('zh-TW')
  })

  it('should set specific language', () => {
    const TestComponent = defineComponent({
      setup() {
        const { setLanguage, locale } = useLanguage()
        return { setLanguage, locale }
      },
      template: '<div>{{ locale }}</div>'
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    })

    const vm = wrapper.vm as any
    expect(vm.locale).toBe('zh-TW')

    vm.setLanguage('en')
    expect(vm.locale).toBe('en')

    vm.setLanguage('zh-TW')
    expect(vm.locale).toBe('zh-TW')
  })

  it('should update language button text based on current locale', () => {
    const TestComponent = defineComponent({
      setup() {
        const { languageButtonText, toggleLanguage } = useLanguage()
        return { languageButtonText, toggleLanguage }
      },
      template: '<div>{{ languageButtonText }}</div>'
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    })

    const vm = wrapper.vm as any
    expect(vm.languageButtonText).toBe('English')

    vm.toggleLanguage()
    expect(vm.languageButtonText).toBe('正體中文')
  })

  it('should sync with language store', () => {
    const TestComponent = defineComponent({
      setup() {
        return useLanguage()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [i18n]
      }
    })

    const vm = wrapper.vm as any
    const store = useLanguageStore()

    vm.toggleLanguage()
    expect(store.currentLocale).toBe('en')

    vm.toggleLanguage()
    expect(store.currentLocale).toBe('zh-TW')
  })
})
