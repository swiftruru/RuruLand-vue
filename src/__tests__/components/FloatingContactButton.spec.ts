import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import FloatingContactButton from '../../components/FloatingContactButton.vue'

// 創建 i18n 實例用於測試
const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      common: {
        close: '關閉'
      },
      contact: {
        floatingButton: '快速聯絡'
      }
    },
    'en': {
      common: {
        close: 'Close'
      },
      contact: {
        floatingButton: 'Quick Contact'
      }
    }
  }
})

describe('FloatingContactButton', () => {
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(FloatingContactButton, {
      global: {
        plugins: [i18n]
      }
    })
  })

  it('should render the main contact button', () => {
    const mainButton = wrapper.find('.contact-main-btn')
    expect(mainButton.exists()).toBe(true)
  })

  it('should show button text', () => {
    const buttonText = wrapper.find('.btn-text')
    expect(buttonText.exists()).toBe(true)
    expect(buttonText.text()).toBe('聯絡')
  })

  it('should not show contact panel initially', () => {
    const panel = wrapper.find('.contact-panel')
    expect(panel.exists()).toBe(false)
  })

  it('should expand contact panel when button is clicked', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const panel = wrapper.find('.contact-panel')
    expect(panel.exists()).toBe(true)
  })

  it('should hide main button when expanded', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    // 等待動畫完成
    await wrapper.vm.$nextTick()

    // 主按鈕應該被隱藏（透過 v-if）
    expect(wrapper.vm.isExpanded).toBe(true)
  })

  it('should show all contact items in panel', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const contactItems = wrapper.findAll('.contact-item')
    expect(contactItems.length).toBe(3) // Email, GitHub, Phone
  })

  it('should have correct email link', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const emailLink = wrapper.find('a[href^="mailto:"]')
    expect(emailLink.exists()).toBe(true)
    expect(emailLink.attributes('href')).toBe('mailto:ruru@swift.moe')
  })

  it('should have correct GitHub link', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const githubLink = wrapper.find('a[href*="github.com"]')
    expect(githubLink.exists()).toBe(true)
    expect(githubLink.attributes('href')).toBe('https://github.com/swiftruru')
    expect(githubLink.attributes('target')).toBe('_blank')
    expect(githubLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('should have correct phone link', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const phoneLink = wrapper.find('a[href^="tel:"]')
    expect(phoneLink.exists()).toBe(true)
    expect(phoneLink.attributes('href')).toBe('tel:+886977006588')
  })

  it('should show backdrop when expanded', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const backdrop = wrapper.find('.backdrop')
    expect(backdrop.exists()).toBe(true)
  })

  it('should close panel when close button is clicked', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const closeButton = wrapper.find('.close-btn')
    await closeButton.trigger('click')

    expect(wrapper.vm.isExpanded).toBe(false)
  })

  it('should close panel when backdrop is clicked', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const backdrop = wrapper.find('.backdrop')
    await backdrop.trigger('click')

    expect(wrapper.vm.isExpanded).toBe(false)
  })

  it('should have proper ARIA labels', () => {
    const mainButton = wrapper.find('.contact-main-btn')
    expect(mainButton.attributes('aria-label')).toBe('快速聯絡')
  })

  it('should have close button with ARIA label when expanded', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const closeButton = wrapper.find('.close-btn')
    expect(closeButton.attributes('aria-label')).toBe('關閉')
  })

  it('should have panel header with title', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const header = wrapper.find('.panel-header h3')
    expect(header.exists()).toBe(true)
    expect(header.text()).toBe('快速聯絡')
  })

  it('should display correct contact labels', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const labels = wrapper.findAll('.label')
    expect(labels.length).toBe(3)
    expect(labels[0].text()).toBe('Email')
    expect(labels[1].text()).toBe('GitHub')
    expect(labels[2].text()).toBe('Phone')
  })

  it('should display correct contact values', async () => {
    const mainButton = wrapper.find('.contact-main-btn')
    await mainButton.trigger('click')

    const values = wrapper.findAll('.value')
    expect(values.length).toBe(3)
    expect(values[0].text()).toBe('ruru@swift.moe')
    expect(values[1].text()).toBe('@swiftruru')
    expect(values[2].text()).toBe('0977-006-588')
  })
})
