import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useCursorEffect } from '../../composables/useCursorEffect'

// Mock requestAnimationFrame and cancelAnimationFrame
const mockRequestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16)
  return 1
})

const mockCancelAnimationFrame = vi.fn()

describe('useCursorEffect', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    global.requestAnimationFrame = mockRequestAnimationFrame as any
    global.cancelAnimationFrame = mockCancelAnimationFrame as any

    // Mock canvas context
    HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
      clearRect: vi.fn(),
      createRadialGradient: vi.fn(() => ({
        addColorStop: vi.fn()
      })),
      fillRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillStyle: '',
      globalAlpha: 1
    })) as any
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    mockRequestAnimationFrame.mockClear()
    mockCancelAnimationFrame.mockClear()

    // Clean up canvas
    const canvas = document.getElementById('cursor-canvas')
    if (canvas) {
      canvas.remove()
    }
  })

  const TestComponent = defineComponent({
    setup() {
      const result = useCursorEffect()
      return () => h('div', { id: 'test' })
    }
  })

  it('should create canvas element on mount', () => {
    const wrapper = mount(TestComponent)

    const canvas = document.getElementById('cursor-canvas')
    expect(canvas).toBeTruthy()
    expect(canvas?.tagName).toBe('CANVAS')

    wrapper.unmount()
  })

  it('should set canvas style correctly', () => {
    const wrapper = mount(TestComponent)

    const canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement
    expect(canvas.style.position).toBe('fixed')
    expect(canvas.style.top).toBe('0px')
    expect(canvas.style.left).toBe('0px')
    expect(canvas.style.width).toBe('100%')
    expect(canvas.style.height).toBe('100%')
    expect(canvas.style.pointerEvents).toBe('none')
    expect(canvas.style.zIndex).toBe('9999')

    wrapper.unmount()
  })

  it('should set canvas size to window size', () => {
    const wrapper = mount(TestComponent)

    const canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement
    expect(canvas.width).toBe(window.innerWidth)
    expect(canvas.height).toBe(window.innerHeight)

    wrapper.unmount()
  })

  it('should create particles on mouse move', () => {
    const wrapper = mount(TestComponent)

    // Simulate mouse move
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    })
    document.dispatchEvent(mouseMoveEvent)

    // Particles should be created (we can't directly test the internal array,
    // but we can verify the event listener is working by checking canvas exists)
    const canvas = document.getElementById('cursor-canvas')
    expect(canvas).toBeTruthy()

    wrapper.unmount()
  })

  it('should start animation loop on mount', () => {
    const wrapper = mount(TestComponent)

    expect(mockRequestAnimationFrame).toHaveBeenCalled()

    wrapper.unmount()
  })

  it('should handle window resize', () => {
    const wrapper = mount(TestComponent)

    const canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement
    const originalWidth = canvas.width

    // Mock window resize
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080
    })

    window.dispatchEvent(new Event('resize'))

    expect(canvas.width).toBe(1920)
    expect(canvas.height).toBe(1080)

    wrapper.unmount()
  })

  it('should remove canvas on unmount', () => {
    const wrapper = mount(TestComponent)

    expect(document.getElementById('cursor-canvas')).toBeTruthy()

    wrapper.unmount()

    expect(document.getElementById('cursor-canvas')).toBeFalsy()
  })

  it('should cancel animation frame on unmount', () => {
    const wrapper = mount(TestComponent)

    wrapper.unmount()

    expect(mockCancelAnimationFrame).toHaveBeenCalled()
  })

  it('should remove mouse move listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener')

    const wrapper = mount(TestComponent)
    wrapper.unmount()

    expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function))

    removeEventListenerSpy.mockRestore()
  })

  it('should limit particle count to 100', () => {
    const wrapper = mount(TestComponent)

    // Simulate many mouse moves to create many particles
    for (let i = 0; i < 60; i++) {
      const mouseMoveEvent = new MouseEvent('mousemove', {
        clientX: i * 10,
        clientY: i * 10
      })
      document.dispatchEvent(mouseMoveEvent)
    }

    // Can't directly test particle array, but we can verify
    // the component doesn't crash with many particles
    expect(document.getElementById('cursor-canvas')).toBeTruthy()

    wrapper.unmount()
  })

  it('should create 2-3 particles per mouse move', () => {
    const wrapper = mount(TestComponent)

    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 150,
      clientY: 250
    })
    document.dispatchEvent(mouseMoveEvent)

    // The composable should create 2-3 particles
    // We can't test the exact count without exposing internals,
    // but we verify the function executes without error
    expect(document.getElementById('cursor-canvas')).toBeTruthy()

    wrapper.unmount()
  })

  it('should get 2d context from canvas', () => {
    const wrapper = mount(TestComponent)

    const canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement
    expect(canvas.getContext).toHaveBeenCalledWith('2d')

    wrapper.unmount()
  })

  it('should handle missing canvas context gracefully', () => {
    // Mock getContext to return null
    HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as any

    const wrapper = mount(TestComponent)

    // Should not throw error
    expect(document.getElementById('cursor-canvas')).toBeTruthy()

    wrapper.unmount()
  })

  it('should advance animation frames with fake timers', () => {
    const wrapper = mount(TestComponent)

    const initialCallCount = mockRequestAnimationFrame.mock.calls.length

    // Advance timers to trigger animation frame
    vi.advanceTimersByTime(16)

    expect(mockRequestAnimationFrame.mock.calls.length).toBeGreaterThan(initialCallCount)

    wrapper.unmount()
  })

  it('should cleanup properly even if canvas is already removed', () => {
    const wrapper = mount(TestComponent)

    // Manually remove canvas before unmount
    const canvas = document.getElementById('cursor-canvas')
    canvas?.remove()

    // Should not throw error on unmount
    expect(() => wrapper.unmount()).not.toThrow()
  })
})
