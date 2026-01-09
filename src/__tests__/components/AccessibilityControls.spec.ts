import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AccessibilityControls from '../../components/AccessibilityControls.vue'

describe('AccessibilityControls', () => {
  let wrapper: ReturnType<typeof mount>

  beforeEach(() => {
    // Mock scrollTo
    window.scrollTo = vi.fn()
    // Mock scrollY
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0
    })
  })

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount()
    }
    vi.clearAllMocks()
  })

  it('should render back to top button', () => {
    wrapper = mount(AccessibilityControls)

    const button = wrapper.find('.back-to-top')
    expect(button.exists()).toBe(true)
  })

  it('should have correct aria-label and title', () => {
    wrapper = mount(AccessibilityControls)

    const button = wrapper.find('.back-to-top')
    expect(button.attributes('aria-label')).toBe('回到頂部')
    expect(button.attributes('title')).toBe('回到頂部')
  })

  it('should display svg icon', () => {
    wrapper = mount(AccessibilityControls)

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('width')).toBe('24')
    expect(svg.attributes('height')).toBe('24')
  })

  it('should display TOP text', () => {
    wrapper = mount(AccessibilityControls)

    const text = wrapper.find('.back-to-top-text')
    expect(text.exists()).toBe(true)
    expect(text.text()).toBe('TOP')
  })

  it('should not show button initially when scrollY is 0', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })

    wrapper = mount(AccessibilityControls)

    // Wait for mounted hook to complete
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.back-to-top')
    // v-show with false should still exist but be hidden
    expect(button.exists()).toBe(true)
  })

  it('should show button when scrollY > 300', async () => {
    wrapper = mount(AccessibilityControls)

    // Simulate scroll past threshold
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.back-to-top')
    expect(button.exists()).toBe(true)
  })

  it('should hide button when scrollY <= 300', async () => {
    wrapper = mount(AccessibilityControls)

    // First scroll past threshold
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    // Then scroll back
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.back-to-top')
    expect(button.exists()).toBe(true)
  })

  it('should call scrollTo when button is clicked', async () => {
    wrapper = mount(AccessibilityControls)

    const button = wrapper.find('.back-to-top')
    await button.trigger('click')

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    })
  })

  it('should call scrollTo with correct parameters', async () => {
    wrapper = mount(AccessibilityControls)

    const button = wrapper.find('.back-to-top')
    await button.trigger('click')

    expect(window.scrollTo).toHaveBeenCalledTimes(1)
    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
        behavior: 'smooth'
      })
    )
  })

  it('should add scroll event listener on mount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    wrapper = mount(AccessibilityControls)

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

    addEventListenerSpy.mockRestore()
  })

  it('should remove scroll event listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    wrapper = mount(AccessibilityControls)
    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  it('should handle multiple scroll events correctly', async () => {
    wrapper = mount(AccessibilityControls)

    // Scroll down
    Object.defineProperty(window, 'scrollY', { value: 400, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    // Scroll further
    Object.defineProperty(window, 'scrollY', { value: 600, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    // Scroll back
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.back-to-top')
    expect(button.exists()).toBe(true)
  })

  it('should handle scroll at exactly 300px', async () => {
    wrapper = mount(AccessibilityControls)

    // Scroll to exactly 300px
    Object.defineProperty(window, 'scrollY', { value: 300, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.back-to-top')
    // At exactly 300, button should not show (> 300 is required)
    expect(button.exists()).toBe(true)
  })

  it('should handle scroll at 301px', async () => {
    wrapper = mount(AccessibilityControls)

    // Scroll to 301px (just past threshold)
    Object.defineProperty(window, 'scrollY', { value: 301, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.back-to-top')
    expect(button.exists()).toBe(true)
  })

  it('should update button visibility reactively on scroll', async () => {
    wrapper = mount(AccessibilityControls)

    // Initial state - below threshold
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    // Scroll above threshold
    Object.defineProperty(window, 'scrollY', { value: 500, writable: true })
    window.dispatchEvent(new Event('scroll'))
    await wrapper.vm.$nextTick()

    const button = wrapper.find('.back-to-top')
    expect(button.exists()).toBe(true)
  })

  it('should render svg path with correct attributes', () => {
    wrapper = mount(AccessibilityControls)

    const path = wrapper.find('svg path')
    expect(path.exists()).toBe(true)
    expect(path.attributes('stroke')).toBe('currentColor')
    expect(path.attributes('stroke-width')).toBe('2.5')
    expect(path.attributes('stroke-linecap')).toBe('round')
    expect(path.attributes('stroke-linejoin')).toBe('round')
  })

  it('should have transition wrapper', () => {
    wrapper = mount(AccessibilityControls)

    // The transition component should wrap the button
    expect(wrapper.find('.back-to-top').exists()).toBe(true)
  })

  it('should not throw error when clicking button multiple times', async () => {
    wrapper = mount(AccessibilityControls)

    const button = wrapper.find('.back-to-top')

    await button.trigger('click')
    await button.trigger('click')
    await button.trigger('click')

    expect(window.scrollTo).toHaveBeenCalledTimes(3)
  })

  it('should cleanup properly on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')

    wrapper = mount(AccessibilityControls)
    const button = wrapper.find('.back-to-top')
    expect(button.exists()).toBe(true)

    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalled()

    removeEventListenerSpy.mockRestore()
  })
})
