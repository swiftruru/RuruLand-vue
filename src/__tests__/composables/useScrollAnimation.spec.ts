import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useScrollAnimation } from '../../composables/useScrollAnimation'

// Mock IntersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  root: Element | Document | null = null
  rootMargin: string = ''
  thresholds: ReadonlyArray<number> = []

  callback: IntersectionObserverCallback
  elements: Set<Element> = new Set()

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.rootMargin = options?.rootMargin || ''
    this.thresholds = Array.isArray(options?.threshold)
      ? options.threshold
      : [options?.threshold || 0]
  }

  observe(element: Element) {
    this.elements.add(element)
  }

  unobserve(element: Element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  triggerIntersect(element: Element, isIntersecting: boolean) {
    const entry: Partial<IntersectionObserverEntry> = {
      target: element,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now()
    }
    this.callback([entry as IntersectionObserverEntry], this)
  }
}

describe('useScrollAnimation', () => {
  let mockObserver: MockIntersectionObserver
  let cleanup: (() => void) | undefined

  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback, options) => {
      mockObserver = new MockIntersectionObserver(callback, options)
      return mockObserver
    }) as any

    // 清理 DOM
    document.body.innerHTML = ''
  })

  afterEach(() => {
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }
    vi.restoreAllMocks()
  })

  it('should initialize scroll observer', () => {
    const element = document.createElement('div')
    element.classList.add('fade-up')
    document.body.appendChild(element)

    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(element)
    }

    expect(global.IntersectionObserver).toHaveBeenCalled()
    expect(mockObserver.elements.has(element)).toBe(true)
  })

  it('should add animate class when element intersects', async () => {
    const element = document.createElement('div')
    element.classList.add('fade-up')
    document.body.appendChild(element)

    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(element)
    }

    await wrapper.vm.$nextTick()

    expect(element.classList.contains('animate')).toBe(false)

    // 觸發交集
    mockObserver.triggerIntersect(element, true)

    expect(element.classList.contains('animate')).toBe(true)
  })

  it('should observe multiple animation types', () => {
    const elements = [
      { class: 'fade-up', element: document.createElement('div') },
      { class: 'fade-down', element: document.createElement('div') },
      { class: 'zoom-in', element: document.createElement('div') },
      { class: 'slide-left', element: document.createElement('div') }
    ]

    elements.forEach(({ element, class: className }) => {
      element.classList.add(className)
      document.body.appendChild(element)
    })

    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    cleanup = () => {
      wrapper.unmount()
      elements.forEach(({ element }) => document.body.removeChild(element))
    }

    elements.forEach(({ element }) => {
      expect(mockObserver.elements.has(element)).toBe(true)
    })
  })

  it('should unobserve element after animation', async () => {
    const element = document.createElement('div')
    element.classList.add('fade-in')
    document.body.appendChild(element)

    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(element)
    }

    await wrapper.vm.$nextTick()

    expect(mockObserver.elements.has(element)).toBe(true)

    // 觸發交集
    mockObserver.triggerIntersect(element, true)

    // 元素應該被停止觀察
    expect(mockObserver.elements.has(element)).toBe(false)
  })

  it('should provide smoothScrollTo function', () => {
    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    expect(typeof vm.smoothScrollTo).toBe('function')
  })

  it('should scroll to target element smoothly', () => {
    const targetElement = document.createElement('section')
    targetElement.id = 'test-section'
    document.body.appendChild(targetElement)

    const scrollIntoViewMock = vi.fn()
    targetElement.scrollIntoView = scrollIntoViewMock

    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(targetElement)
    }

    vm.smoothScrollTo('#test-section')

    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    })
  })

  it('should handle smooth scroll to non-existent element', () => {
    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    cleanup = () => wrapper.unmount()

    // 不應該拋出錯誤
    expect(() => vm.smoothScrollTo('#non-existent')).not.toThrow()
  })

  it('should add smooth scroll to anchor links', async () => {
    const anchor = document.createElement('a')
    anchor.href = '#test'
    document.body.appendChild(anchor)

    const targetElement = document.createElement('section')
    targetElement.id = 'test'
    document.body.appendChild(targetElement)

    const scrollIntoViewMock = vi.fn()
    targetElement.scrollIntoView = scrollIntoViewMock

    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    cleanup = () => {
      wrapper.unmount()
      document.body.removeChild(anchor)
      document.body.removeChild(targetElement)
    }

    await wrapper.vm.$nextTick()

    // 模擬點擊錨點
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    anchor.dispatchEvent(clickEvent)

    await wrapper.vm.$nextTick()

    expect(scrollIntoViewMock).toHaveBeenCalled()
  })

  it('should disconnect observer on unmount', async () => {
    const element = document.createElement('div')
    element.classList.add('fade-up')
    document.body.appendChild(element)

    const TestComponent = defineComponent({
      setup() {
        return useScrollAnimation()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)

    await wrapper.vm.$nextTick()
    expect(mockObserver.elements.size).toBeGreaterThan(0)

    const disconnectSpy = vi.spyOn(mockObserver, 'disconnect')

    wrapper.unmount()

    expect(disconnectSpy).toHaveBeenCalled()

    document.body.removeChild(element)
  })
})
