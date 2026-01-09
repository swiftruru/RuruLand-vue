import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ContactForm from '../../components/ContactForm.vue'
import * as googleAnalytics from '../../composables/useGoogleAnalytics'

// Mock trackEvent function
vi.mock('../../composables/useGoogleAnalytics', () => ({
  trackEvent: vi.fn()
}))

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      contact: {
        form: {
          name: '姓名',
          namePlaceholder: '請輸入您的姓名',
          email: 'Email',
          emailPlaceholder: '請輸入您的 Email',
          subject: '主旨',
          subjectPlaceholder: '請輸入主旨',
          message: '訊息',
          messagePlaceholder: '請輸入您的訊息',
          submit: '送出',
          sending: '傳送中...',
          successMessage: '訊息已成功送出！',
          errorMessage: '發送失敗，請稍後再試。'
        }
      }
    }
  }
})

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock fetch
    global.fetch = vi.fn()
  })

  it('should render form fields correctly', () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('#name').exists()).toBe(true)
    expect(wrapper.find('#email').exists()).toBe(true)
    expect(wrapper.find('#subject').exists()).toBe(true)
    expect(wrapper.find('#message').exists()).toBe(true)
  })

  it('should render labels with correct text', () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('Email')
    expect(wrapper.text()).toContain('主旨')
    expect(wrapper.text()).toContain('訊息')
  })

  it('should have submit button', () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    const submitBtn = wrapper.find('button[type="submit"]')
    expect(submitBtn.exists()).toBe(true)
    expect(submitBtn.text()).toBe('送出')
  })

  it('should bind form data with v-model', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    const nameInput = wrapper.find('#name')
    const emailInput = wrapper.find('#email')
    const subjectInput = wrapper.find('#subject')
    const messageInput = wrapper.find('#message')

    await nameInput.setValue('John Doe')
    await emailInput.setValue('john@example.com')
    await subjectInput.setValue('Test Subject')
    await messageInput.setValue('Test Message')

    expect((nameInput.element as HTMLInputElement).value).toBe('John Doe')
    expect((emailInput.element as HTMLInputElement).value).toBe('john@example.com')
    expect((subjectInput.element as HTMLInputElement).value).toBe('Test Subject')
    expect((messageInput.element as HTMLTextAreaElement).value).toBe('Test Message')
  })

  it('should disable form during submission', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    // Mock fetch to delay response
    ;(global.fetch as any).mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          json: async () => ({ success: true })
        }), 100)
      )
    )

    const form = wrapper.find('form')
    const submitPromise = form.trigger('submit')

    await wrapper.vm.$nextTick()

    // 檢查 disabled 屬性（注意：空字串也代表 disabled）
    const nameInput = wrapper.find('#name')
    const submitBtn = wrapper.find('button[type="submit"]')

    expect(nameInput.attributes('disabled')).toBe('')
    expect(submitBtn.attributes('disabled')).toBe('')

    await submitPromise
  })

  it('should show loading text during submission', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    ;(global.fetch as any).mockImplementation(() =>
      new Promise(resolve =>
        setTimeout(() => resolve({
          json: async () => ({ success: true })
        }), 100)
      )
    )

    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('傳送中...')
  })

  it('should show success message on successful submission', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    ;(global.fetch as any).mockResolvedValue({
      json: async () => ({ success: true })
    })

    await wrapper.find('#name').setValue('John')
    await wrapper.find('#email').setValue('john@example.com')
    await wrapper.find('#subject').setValue('Test')
    await wrapper.find('#message').setValue('Message')

    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('訊息已成功送出！')
  })

  it('should show error message on failed submission', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    ;(global.fetch as any).mockResolvedValue({
      json: async () => ({ success: false, message: 'Error' })
    })

    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('發送失敗，請稍後再試。')
  })

  it('should show error message on network error', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('發送失敗，請稍後再試。')
  })

  it('should clear form data after successful submission', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    ;(global.fetch as any).mockResolvedValue({
      json: async () => ({ success: true })
    })

    await wrapper.find('#name').setValue('John')
    await wrapper.find('#email').setValue('john@example.com')
    await wrapper.find('#subject').setValue('Test')
    await wrapper.find('#message').setValue('Message')

    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect((wrapper.find('#name').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#email').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#subject').element as HTMLInputElement).value).toBe('')
    expect((wrapper.find('#message').element as HTMLTextAreaElement).value).toBe('')
  })

  it('should track success event with Google Analytics', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    ;(global.fetch as any).mockResolvedValue({
      json: async () => ({ success: true })
    })

    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(googleAnalytics.trackEvent).toHaveBeenCalledWith('contact_form_submit', {
      status: 'success'
    })
  })

  it('should track error event with Google Analytics', async () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    ;(global.fetch as any).mockRejectedValue(new Error('Network error'))

    const form = wrapper.find('form')
    await form.trigger('submit')

    await wrapper.vm.$nextTick()
    await wrapper.vm.$nextTick()

    expect(googleAnalytics.trackEvent).toHaveBeenCalledWith('contact_form_submit', {
      status: 'error',
      error: 'network_error'
    })
  })

  it('should have required attributes on inputs', () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('#name').attributes('required')).toBeDefined()
    expect(wrapper.find('#email').attributes('required')).toBeDefined()
    expect(wrapper.find('#subject').attributes('required')).toBeDefined()
    expect(wrapper.find('#message').attributes('required')).toBeDefined()
  })

  it('should have correct input types', () => {
    const wrapper = mount(ContactForm, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('#name').attributes('type')).toBe('text')
    expect(wrapper.find('#email').attributes('type')).toBe('email')
    expect(wrapper.find('#subject').attributes('type')).toBe('text')
  })
})
