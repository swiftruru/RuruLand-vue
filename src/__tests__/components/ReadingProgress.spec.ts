import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ReadingProgress from '../../components/ReadingProgress.vue'

describe('ReadingProgress', () => {
  let cleanup: (() => void) | undefined

  beforeEach(() => {
    // Mock window properties
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1000
    })

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    })

    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 3000
    })

    Object.defineProperty(document.documentElement, 'scrollTop', {
      writable: true,
      configurable: true,
      value: 0
    })
  })

  afterEach(() => {
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }
  })

  it('should render progress bar', () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    const progressBar = wrapper.find('.reading-progress-bar')
    expect(progressBar.exists()).toBe(true)
  })

  it('should initialize with 0% width', () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    const progressBar = wrapper.find('.reading-progress-bar')
    expect(progressBar.attributes('style')).toContain('width: 0%')
  })

  it('should update progress on scroll', async () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    // Simulate scroll to 50%
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 1000 // 50% of scrollable height (2000)
    })

    // Trigger scroll event
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    const style = progressBar.attributes('style')
    expect(style).toContain('width:')
    expect(style).toContain('50%')
  })

  it('should show 100% when scrolled to bottom', async () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    // Scroll to bottom
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 2000 // 100% of scrollable height (3000 - 1000)
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    expect(progressBar.attributes('style')).toContain('100%')
  })

  it('should not exceed 100%', async () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    // Scroll beyond bottom
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 3000
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    expect(progressBar.attributes('style')).toContain('100%')
  })

  it('should not go below 0%', async () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    // Negative scroll (shouldn't happen, but testing edge case)
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: -100
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    expect(progressBar.attributes('style')).toContain('0%')
  })

  it('should handle scroll at 25%', async () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 500 // 25% of 2000
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    expect(progressBar.attributes('style')).toContain('25%')
  })

  it('should handle scroll at 75%', async () => {
    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 1500 // 75% of 2000
    })

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    expect(progressBar.attributes('style')).toContain('75%')
  })

  it('should add passive event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function),
      { passive: true }
    )

    addEventListenerSpy.mockRestore()
  })

  it('should remove event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    const wrapper = mount(ReadingProgress)
    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'scroll',
      expect.any(Function)
    )

    removeEventListenerSpy.mockRestore()
  })

  it('should handle case when scrollable height is 0', async () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      configurable: true,
      value: 1000 // Same as window height
    })

    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    // When scrollable height is 0, progress should remain 0
    expect(progressBar.attributes('style')).toContain('0%')
  })

  it('should update immediately on mount', async () => {
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 1000
    })

    const wrapper = mount(ReadingProgress)
    cleanup = () => wrapper.unmount()

    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.reading-progress-bar')
    // Should reflect current scroll position
    expect(progressBar.attributes('style')).toContain('50%')
  })
})
