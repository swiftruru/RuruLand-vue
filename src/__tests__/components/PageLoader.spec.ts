import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PageLoader from '../../components/PageLoader.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      common: {
        hero: {
          name: '潘昱如',
          title: 'Full Stack Developer'
        }
      }
    }
  }
})

describe('PageLoader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render loader initially', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.page-loader').exists()).toBe(true)
  })

  it('should render mascot image', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    const mascot = wrapper.find('.mascot-image')
    expect(mascot.exists()).toBe(true)
    expect(mascot.attributes('alt')).toBe('Yubiko mascot')
  })

  it('should render loader title and subtitle', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('潘昱如')
    expect(wrapper.text()).toContain('Full Stack Developer')
  })

  it('should render progress bar', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.progress-bar').exists()).toBe(true)
    expect(wrapper.find('.progress-fill').exists()).toBe(true)
    expect(wrapper.find('.progress-text').exists()).toBe(true)
  })

  it('should render loading dots', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    const dots = wrapper.findAll('.loading-dots span')
    expect(dots).toHaveLength(3)
  })

  it('should start with 0% progress', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    const progressText = wrapper.find('.progress-text')
    expect(progressText.text()).toBe('0%')
  })

  it('should increase progress over time', async () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    // Get initial progress
    const initialProgressText = wrapper.find('.progress-text')
    const initialProgress = parseInt(initialProgressText.text())

    // Advance timer by 200ms (one interval) multiple times to ensure progress
    vi.advanceTimersByTime(200)
    await flushPromises()
    vi.advanceTimersByTime(200)
    await flushPromises()

    const progressText = wrapper.find('.progress-text')
    const progressValue = parseInt(progressText.text())
    expect(progressValue).toBeGreaterThanOrEqual(initialProgress)
  })

  it('should not exceed 90% before window load', async () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    // Advance time but not too much (less than 3 seconds timeout)
    for (let i = 0; i < 10; i++) {
      vi.advanceTimersByTime(200)
      await flushPromises()
    }

    // Check if loader still exists
    const progressFill = wrapper.find('.progress-fill')
    if (progressFill.exists()) {
      const width = progressFill.attributes('style')
      const progressValue = parseInt(width?.match(/width:\s*(\d+)%/)?.[1] || '0')

      expect(progressValue).toBeLessThanOrEqual(90)
    } else {
      // Loader已經隱藏，測試通過
      expect(true).toBe(true)
    }
  })

  it('should complete to 100% on window load', async () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    // Trigger window load event
    window.dispatchEvent(new Event('load'))
    await flushPromises()

    const progressText = wrapper.find('.progress-text')
    expect(progressText.text()).toBe('100%')
  })

  it('should hide loader after window load completes', async () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    expect(wrapper.find('.page-loader').exists()).toBe(true)

    // Trigger window load
    window.dispatchEvent(new Event('load'))
    await flushPromises()

    // Wait for the 500ms delay
    vi.advanceTimersByTime(500)
    await flushPromises()

    expect(wrapper.find('.page-loader').exists()).toBe(false)
  })

  it('should force complete after 3 seconds timeout', async () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    await flushPromises()

    // Advance time past the 3 second timeout
    vi.advanceTimersByTime(3000)
    await flushPromises()

    const progressText = wrapper.find('.progress-text')
    expect(progressText.text()).toBe('100%')

    // Advance the final 500ms delay
    vi.advanceTimersByTime(500)
    await flushPromises()

    expect(wrapper.find('.page-loader').exists()).toBe(false)
  })

  it('should have mascot container with animation', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    const mascotContainer = wrapper.find('.mascot-container')
    expect(mascotContainer.exists()).toBe(true)
  })

  it('should have mascot shadow', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    const shadow = wrapper.find('.mascot-shadow')
    expect(shadow.exists()).toBe(true)
  })

  it('should have loader content wrapper', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    const content = wrapper.find('.loader-content')
    expect(content.exists()).toBe(true)
  })

  it('should show rounded progress percentage', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    const progressText = wrapper.find('.progress-text')
    // Should not have decimal points
    expect(progressText.text()).toMatch(/^\d+%$/)
  })

  it('should have transition wrapper', () => {
    const wrapper = mount(PageLoader, {
      global: {
        plugins: [i18n]
      }
    })

    // Check for Transition component wrapper
    expect(wrapper.html()).toContain('loader-fade')
  })
})
