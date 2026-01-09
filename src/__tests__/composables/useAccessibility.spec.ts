import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useAccessibility } from '../../composables/useAccessibility'

describe('useAccessibility', () => {
  let cleanup: (() => void) | undefined

  beforeEach(() => {
    // 清理 localStorage
    localStorage.clear()
    // 清理 body class
    document.body.className = ''
  })

  afterEach(() => {
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }
    localStorage.clear()
    document.body.className = ''
  })

  it('should initialize with default values', () => {
    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    expect(vm.isHighContrast).toBe(false)
    expect(vm.isKeyboardNavigation).toBe(false)
  })

  it('should toggle high contrast mode', () => {
    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    expect(vm.isHighContrast).toBe(false)
    expect(document.body.classList.contains('high-contrast')).toBe(false)

    vm.toggleHighContrast()
    expect(vm.isHighContrast).toBe(true)
    expect(document.body.classList.contains('high-contrast')).toBe(true)
    expect(localStorage.getItem('highContrast')).toBe('true')

    vm.toggleHighContrast()
    expect(vm.isHighContrast).toBe(false)
    expect(document.body.classList.contains('high-contrast')).toBe(false)
    expect(localStorage.getItem('highContrast')).toBe('false')
  })

  it('should restore high contrast mode from localStorage', () => {
    localStorage.setItem('highContrast', 'true')

    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    expect(vm.isHighContrast).toBe(true)
    expect(document.body.classList.contains('high-contrast')).toBe(true)
  })

  it('should enable high contrast mode', () => {
    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    vm.enableHighContrast()
    expect(vm.isHighContrast).toBe(true)
    expect(document.body.classList.contains('high-contrast')).toBe(true)
  })

  it('should disable high contrast mode', () => {
    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    vm.enableHighContrast()
    expect(vm.isHighContrast).toBe(true)

    vm.disableHighContrast()
    expect(vm.isHighContrast).toBe(false)
    expect(document.body.classList.contains('high-contrast')).toBe(false)
  })

  it('should detect keyboard navigation with Tab key', async () => {
    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    expect(vm.isKeyboardNavigation).toBe(false)

    // 模擬按下 Tab 鍵
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
    document.dispatchEvent(tabEvent)

    await wrapper.vm.$nextTick()

    expect(document.body.classList.contains('keyboard-navigation')).toBe(true)
  })

  it('should disable keyboard navigation on mouse click', async () => {
    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    // 先啟用鍵盤導航
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab' })
    document.dispatchEvent(tabEvent)
    await wrapper.vm.$nextTick()

    expect(document.body.classList.contains('keyboard-navigation')).toBe(true)

    // 模擬滑鼠點擊
    const mouseEvent = new MouseEvent('mousedown')
    document.dispatchEvent(mouseEvent)
    await wrapper.vm.$nextTick()

    expect(document.body.classList.contains('keyboard-navigation')).toBe(false)
  })

  it('should announce message to screen reader', () => {
    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    vm.announceToScreenReader('Test message', 'polite')

    const announcement = document.querySelector('[role="status"]')
    expect(announcement).toBeTruthy()
    expect(announcement?.textContent).toBe('Test message')
    expect(announcement?.getAttribute('aria-live')).toBe('polite')
  })

  it('should trap focus within element', () => {
    const container = document.createElement('div')
    const button1 = document.createElement('button')
    const button2 = document.createElement('button')
    const button3 = document.createElement('button')

    button1.textContent = 'Button 1'
    button2.textContent = 'Button 2'
    button3.textContent = 'Button 3'

    container.appendChild(button1)
    container.appendChild(button2)
    container.appendChild(button3)
    document.body.appendChild(container)

    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(container)
    }

    const removeTrap = vm.trapFocus(container)

    // 第一個按鈕應該獲得焦點
    expect(document.activeElement).toBe(button1)

    // 模擬按 Tab 到最後一個元素
    button3.focus()
    expect(document.activeElement).toBe(button3)

    // 從最後一個元素按 Tab 應該回到第一個
    const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true })
    container.dispatchEvent(tabEvent)

    // 清理
    removeTrap()
  })

  it('should handle trapFocus with no focusable elements', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const TestComponent = defineComponent({
      setup() {
        return useAccessibility()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(container)
    }

    const removeTrap = vm.trapFocus(container)

    // 應該返回空的清理函數，不拋出錯誤
    expect(typeof removeTrap).toBe('function')
    expect(() => removeTrap()).not.toThrow()
  })
})
