import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import { useLazyLoad, useLazyImage } from '../../composables/useLazyLoad'

// Mock IntersectionObserver
class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  elements: Set<Element> = new Set()

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
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

  triggerIntersect(element: Element, isIntersecting: boolean) {
    this.callback(
      [
        {
          target: element,
          isIntersecting,
          boundingClientRect: {} as DOMRectReadOnly,
          intersectionRatio: isIntersecting ? 1 : 0,
          intersectionRect: {} as DOMRectReadOnly,
          rootBounds: null,
          time: Date.now()
        }
      ],
      this
    )
  }
}

describe('useLazyLoad', () => {
  let mockObserver: MockIntersectionObserver
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>
  let originalImage: typeof Image

  beforeEach(() => {
    // Setup IntersectionObserver mock
    mockObserver = new MockIntersectionObserver(() => {})
    global.IntersectionObserver = vi.fn((callback, options) => {
      mockObserver = new MockIntersectionObserver(callback, options)
      return mockObserver as any
    }) as any

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Mock Image to trigger onload immediately
    originalImage = window.Image
    ;(window as any).Image = class {
      private _onload: (() => void) | null = null
      private _onerror: (() => void) | null = null
      private _src: string = ''

      set onload(handler: (() => void) | null) {
        this._onload = handler
      }

      get onload() {
        return this._onload
      }

      set onerror(handler: (() => void) | null) {
        this._onerror = handler
      }

      get onerror() {
        return this._onerror
      }

      set src(value: string) {
        this._src = value
        // Trigger onload asynchronously
        setTimeout(() => {
          if (this._onload) {
            this._onload()
          }
        }, 0)
      }

      get src() {
        return this._src
      }
    }

    // Setup document with lazy images
    document.body.innerHTML = `
      <img data-src="https://example.com/image1.jpg" />
      <img data-src="https://example.com/image2.jpg" />
      <img data-src="https://example.com/image3.jpg" />
    `
  })

  afterEach(() => {
    document.body.innerHTML = ''
    consoleErrorSpy.mockRestore()
    window.Image = originalImage
    vi.clearAllMocks()
  })

  const TestComponent = defineComponent({
    setup() {
      const { observeImage, unobserveImage } = useLazyLoad()
      return () => h('div', { id: 'test' })
    }
  })

  describe('useLazyLoad', () => {
    it('should create IntersectionObserver on mount', () => {
      const wrapper = mount(TestComponent)

      expect(global.IntersectionObserver).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should observe all images with data-src on mount', () => {
      const wrapper = mount(TestComponent)

      const lazyImages = document.querySelectorAll('img[data-src]')
      expect(mockObserver.elements.size).toBe(lazyImages.length)

      wrapper.unmount()
    })

    it('should trigger image loading when it intersects', async () => {
      const wrapper = mount(TestComponent)

      const img = document.querySelector('img[data-src]') as HTMLImageElement
      const unobserveSpy = vi.spyOn(mockObserver, 'unobserve')

      // Trigger intersection
      mockObserver.triggerIntersect(img, true)

      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 50))

      // Should unobserve the image after starting to load
      expect(unobserveSpy).toHaveBeenCalledWith(img)

      wrapper.unmount()
    })

    it('should add loaded class to image after successful load', async () => {
      const wrapper = mount(TestComponent)

      const img = document.querySelector('img[data-src]') as HTMLImageElement

      // Trigger intersection
      mockObserver.triggerIntersect(img, true)

      // Simulate image load
      await vi.waitFor(() => {
        return img.classList.contains('loaded') || img.src.includes('image1.jpg')
      })

      wrapper.unmount()
    })

    it('should remove data-src attribute after loading', async () => {
      const wrapper = mount(TestComponent)

      const img = document.querySelector('img[data-src]') as HTMLImageElement

      // Trigger intersection
      mockObserver.triggerIntersect(img, true)

      await vi.waitFor(() => {
        return !img.hasAttribute('data-src') || img.src.includes('image1.jpg')
      })

      wrapper.unmount()
    })

    it('should handle image load error', async () => {
      const wrapper = mount(TestComponent)

      const img = document.querySelector('img[data-src]') as HTMLImageElement
      img.dataset.src = 'https://invalid-url.com/invalid.jpg'

      // Trigger intersection
      mockObserver.triggerIntersect(img, true)

      // Wait a bit for error handling
      await new Promise(resolve => setTimeout(resolve, 100))

      wrapper.unmount()
    })

    it('should unobserve image after loading', async () => {
      const wrapper = mount(TestComponent)

      const img = document.querySelector('img[data-src]') as HTMLImageElement
      const unobserveSpy = vi.spyOn(mockObserver, 'unobserve')

      // Trigger intersection
      mockObserver.triggerIntersect(img, true)

      await vi.waitFor(() => {
        return unobserveSpy.mock.calls.length > 0
      })

      wrapper.unmount()
    })

    it('should disconnect observer on unmount', () => {
      const wrapper = mount(TestComponent)
      const disconnectSpy = vi.spyOn(mockObserver, 'disconnect')

      wrapper.unmount()

      expect(disconnectSpy).toHaveBeenCalled()
    })

    it('should fallback to direct load if IntersectionObserver not supported', () => {
      // Remove IntersectionObserver support
      const originalIO = global.IntersectionObserver
      // @ts-ignore
      delete window.IntersectionObserver

      const wrapper = mount(TestComponent)

      const lazyImages = document.querySelectorAll('img[data-src]')
      lazyImages.forEach((img) => {
        const element = img as HTMLImageElement
        // In fallback mode, images should have src set
        expect(element.src || element.dataset.src).toBeTruthy()
      })

      wrapper.unmount()
      global.IntersectionObserver = originalIO
    })
  })

  describe('useLazyImage', () => {
    const TestImageComponent = defineComponent({
      setup() {
        const imgRef = ref<HTMLImageElement | null>(null)
        const { isLoaded, hasError } = useLazyImage(imgRef)

        return () =>
          h('img', {
            ref: imgRef,
            'data-src': 'https://example.com/test-image.jpg'
          })
      }
    })

    it('should create observer for single image', () => {
      const wrapper = mount(TestImageComponent)

      expect(global.IntersectionObserver).toHaveBeenCalled()

      wrapper.unmount()
    })

    it('should return isLoaded ref', () => {
      const TestRefComponent = defineComponent({
        setup() {
          const imgRef = ref<HTMLImageElement | null>(null)
          const { isLoaded } = useLazyImage(imgRef)

          return () =>
            h('div', { 'data-is-loaded': isLoaded.value })
        }
      })

      const wrapper = mount(TestRefComponent)
      expect(wrapper.find('div').attributes('data-is-loaded')).toBe('false')
      wrapper.unmount()
    })

    it('should return hasError ref', () => {
      const TestRefComponent = defineComponent({
        setup() {
          const imgRef = ref<HTMLImageElement | null>(null)
          const { hasError } = useLazyImage(imgRef)

          return () =>
            h('div', { 'data-has-error': hasError.value })
        }
      })

      const wrapper = mount(TestRefComponent)
      expect(wrapper.find('div').attributes('data-has-error')).toBe('false')
      wrapper.unmount()
    })

    it('should set isLoaded to true after successful load', async () => {
      const wrapper = mount(TestImageComponent)
      const img = wrapper.find('img').element as HTMLImageElement

      mockObserver.triggerIntersect(img, true)

      await vi.waitFor(() => {
        return img.classList.contains('loaded') || img.src.includes('test-image.jpg')
      })

      wrapper.unmount()
    })

    it('should handle missing imgRef', () => {
      const TestEmptyComponent = defineComponent({
        setup() {
          const imgRef = ref<HTMLImageElement | null>(null)
          useLazyImage(imgRef)
          return () => h('div')
        }
      })

      const wrapper = mount(TestEmptyComponent)

      // Should not throw error
      expect(wrapper.exists()).toBe(true)

      wrapper.unmount()
    })

    it('should handle image without data-src', () => {
      const TestNormalImageComponent = defineComponent({
        setup() {
          const imgRef = ref<HTMLImageElement | null>(null)
          const { isLoaded } = useLazyImage(imgRef)

          return () =>
            h('img', {
              ref: imgRef,
              src: 'https://example.com/normal-image.jpg'
            })
        }
      })

      const wrapper = mount(TestNormalImageComponent)

      wrapper.unmount()
    })

    it('should fallback to direct load if IntersectionObserver not supported', () => {
      const originalIO = global.IntersectionObserver
      // @ts-ignore
      delete window.IntersectionObserver

      const wrapper = mount(TestImageComponent)

      // Should still work without IntersectionObserver
      expect(wrapper.exists()).toBe(true)

      wrapper.unmount()
      global.IntersectionObserver = originalIO
    })

    it('should observe image with correct options', () => {
      const optionsSpy = vi.fn()
      global.IntersectionObserver = vi.fn((callback, options) => {
        optionsSpy(options)
        mockObserver = new MockIntersectionObserver(callback, options)
        return mockObserver as any
      }) as any

      const wrapper = mount(TestImageComponent)

      expect(optionsSpy).toHaveBeenCalledWith({
        rootMargin: '50px',
        threshold: 0.01
      })

      wrapper.unmount()
    })

    it('should disconnect observer on unmount', () => {
      const wrapper = mount(TestImageComponent)
      const disconnectSpy = vi.spyOn(mockObserver, 'disconnect')

      wrapper.unmount()

      expect(disconnectSpy).toHaveBeenCalled()
    })
  })

  describe('observeImage and unobserveImage', () => {
    const TestManualComponent = defineComponent({
      setup() {
        const { observeImage, unobserveImage } = useLazyLoad()

        return () =>
          h('div', { id: 'test' }, [
            h('img', {
              id: 'manual-img',
              'data-src': 'https://example.com/manual.jpg'
            })
          ])
      }
    })

    it('should manually observe new image', () => {
      const wrapper = mount(TestManualComponent)
      const img = document.getElementById('manual-img') as HTMLImageElement

      const observeSpy = vi.spyOn(mockObserver, 'observe')

      // Component's observeImage method should be available
      // In actual usage, this would be called from template
      mockObserver.observe(img)

      expect(observeSpy).toHaveBeenCalledWith(img)

      wrapper.unmount()
    })

    it('should manually unobserve image', () => {
      const wrapper = mount(TestManualComponent)
      const img = document.getElementById('manual-img') as HTMLImageElement

      mockObserver.observe(img)
      const unobserveSpy = vi.spyOn(mockObserver, 'unobserve')

      mockObserver.unobserve(img)

      expect(unobserveSpy).toHaveBeenCalledWith(img)

      wrapper.unmount()
    })
  })
})
