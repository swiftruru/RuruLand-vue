import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useMenu } from '../../composables/useMenu'

describe('useMenu', () => {
  let cleanup: (() => void) | undefined

  afterEach(() => {
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }
  })

  it('should initialize with menu closed', () => {
    const TestComponent = defineComponent({
      setup() {
        return useMenu()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    expect(vm.isMenuOpen).toBe(false)
  })

  it('should toggle menu open and closed', () => {
    const TestComponent = defineComponent({
      setup() {
        return useMenu()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    expect(vm.isMenuOpen).toBe(false)

    vm.toggleMenu()
    expect(vm.isMenuOpen).toBe(true)

    vm.toggleMenu()
    expect(vm.isMenuOpen).toBe(false)
  })

  it('should close menu when closeMenu is called', () => {
    const TestComponent = defineComponent({
      setup() {
        return useMenu()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    vm.toggleMenu()
    expect(vm.isMenuOpen).toBe(true)

    vm.closeMenu()
    expect(vm.isMenuOpen).toBe(false)
  })

  it('should close menu when clicking outside', async () => {
    // 建立測試用的 DOM 元素
    const hamburger = document.createElement('div')
    hamburger.className = 'hamburger'
    const navLinks = document.createElement('div')
    navLinks.className = 'nav-links'
    document.body.appendChild(hamburger)
    document.body.appendChild(navLinks)

    const TestComponent = defineComponent({
      setup() {
        return useMenu()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(hamburger)
      document.body.removeChild(navLinks)
    }

    // 打開選單
    vm.toggleMenu()
    expect(vm.isMenuOpen).toBe(true)

    // 點擊外部區域
    const outsideElement = document.createElement('div')
    document.body.appendChild(outsideElement)
    const clickEvent = new MouseEvent('click', { bubbles: true })
    Object.defineProperty(clickEvent, 'target', { value: outsideElement, enumerable: true })
    document.dispatchEvent(clickEvent)

    // 等待下一個 tick
    await wrapper.vm.$nextTick()

    expect(vm.isMenuOpen).toBe(false)
    document.body.removeChild(outsideElement)
  })

  it('should not close menu when clicking inside hamburger', async () => {
    const hamburger = document.createElement('div')
    hamburger.className = 'hamburger'
    const navLinks = document.createElement('div')
    navLinks.className = 'nav-links'
    document.body.appendChild(hamburger)
    document.body.appendChild(navLinks)

    const TestComponent = defineComponent({
      setup() {
        return useMenu()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(hamburger)
      document.body.removeChild(navLinks)
    }

    vm.toggleMenu()
    expect(vm.isMenuOpen).toBe(true)

    // 點擊 hamburger 內部
    const clickEvent = new MouseEvent('click', { bubbles: true })
    Object.defineProperty(clickEvent, 'target', { value: hamburger, enumerable: true })
    document.dispatchEvent(clickEvent)

    await wrapper.vm.$nextTick()

    expect(vm.isMenuOpen).toBe(true)
  })
})
