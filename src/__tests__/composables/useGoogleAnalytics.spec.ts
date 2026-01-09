import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  useGoogleAnalytics,
  trackEvent,
  trackPageView,
  trackShare,
  trackOutboundLink,
  trackContact
} from '../../composables/useGoogleAnalytics'

describe('useGoogleAnalytics', () => {
  let gtagMock: ReturnType<typeof vi.fn>
  let consoleLogSpy: ReturnType<typeof vi.spyOn>
  const originalEnv = import.meta.env.DEV

  beforeEach(() => {
    gtagMock = vi.fn()
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    // Setup window.gtag
    if (typeof window !== 'undefined') {
      ;(window as any).gtag = gtagMock
      ;(window as any).dataLayer = []
    }
  })

  afterEach(() => {
    consoleLogSpy.mockRestore()
    vi.clearAllMocks()
  })

  describe('useGoogleAnalytics', () => {
    it('should log message in development mode', () => {
      // Force DEV mode
      ;(import.meta.env as any).DEV = true

      useGoogleAnalytics()

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[GA] Development mode - event tracking will be logged to console'
      )

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should not throw error when called', () => {
      expect(() => useGoogleAnalytics()).not.toThrow()
    })
  })

  describe('trackEvent', () => {
    it('should log event in development mode', () => {
      ;(import.meta.env as any).DEV = true

      trackEvent('test_event', { param1: 'value1' })

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[GA] Event (dev mode):',
        'test_event',
        { param1: 'value1' }
      )

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should call gtag with event name and params in production', () => {
      ;(import.meta.env as any).DEV = false

      trackEvent('button_click', { button_name: 'subscribe' })

      expect(gtagMock).toHaveBeenCalledWith('event', 'button_click', {
        button_name: 'subscribe'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should call gtag without params', () => {
      ;(import.meta.env as any).DEV = false

      trackEvent('simple_event')

      expect(gtagMock).toHaveBeenCalledWith('event', 'simple_event', undefined)

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should not call gtag if gtag is not available', () => {
      ;(import.meta.env as any).DEV = false
      delete (window as any).gtag

      expect(() => trackEvent('test_event')).not.toThrow()
      expect(gtagMock).not.toHaveBeenCalled()

      ;(window as any).gtag = gtagMock
      ;(import.meta.env as any).DEV = originalEnv
    })
  })

  describe('trackPageView', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'title', {
        value: 'Test Page',
        writable: true,
        configurable: true
      })
      Object.defineProperty(window, 'location', {
        value: { pathname: '/test-path' },
        writable: true,
        configurable: true
      })
    })

    it('should log page view in development mode', () => {
      ;(import.meta.env as any).DEV = true

      trackPageView('My Page', '/my-page')

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[GA] Page view (dev mode):',
        'My Page',
        '/my-page'
      )

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should track page view with custom title and path', () => {
      ;(import.meta.env as any).DEV = false

      trackPageView('Custom Page', '/custom-path')

      expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Custom Page',
        page_path: '/custom-path'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should use document title and window location as defaults', () => {
      ;(import.meta.env as any).DEV = false

      trackPageView()

      expect(gtagMock).toHaveBeenCalledWith('event', 'page_view', {
        page_title: 'Test Page',
        page_path: '/test-path'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should not throw if gtag is not available', () => {
      ;(import.meta.env as any).DEV = false
      delete (window as any).gtag

      expect(() => trackPageView()).not.toThrow()

      ;(window as any).gtag = gtagMock
      ;(import.meta.env as any).DEV = originalEnv
    })
  })

  describe('trackShare', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { href: 'https://example.com/page' },
        writable: true,
        configurable: true
      })
    })

    it('should track share event with platform', () => {
      ;(import.meta.env as any).DEV = false

      trackShare('facebook')

      expect(gtagMock).toHaveBeenCalledWith('event', 'share', {
        method: 'facebook',
        content_type: 'website',
        item_id: 'https://example.com/page'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should track share event with custom URL', () => {
      ;(import.meta.env as any).DEV = false

      trackShare('twitter', 'https://custom-url.com')

      expect(gtagMock).toHaveBeenCalledWith('event', 'share', {
        method: 'twitter',
        content_type: 'website',
        item_id: 'https://custom-url.com'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should use current page URL if no URL provided', () => {
      ;(import.meta.env as any).DEV = false

      trackShare('linkedin')

      expect(gtagMock).toHaveBeenCalledWith('event', 'share', {
        method: 'linkedin',
        content_type: 'website',
        item_id: 'https://example.com/page'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })
  })

  describe('trackOutboundLink', () => {
    it('should track outbound link click with URL', () => {
      ;(import.meta.env as any).DEV = false

      trackOutboundLink('https://external-site.com')

      expect(gtagMock).toHaveBeenCalledWith('event', 'click', {
        event_category: 'outbound',
        event_label: 'https://external-site.com',
        value: 'https://external-site.com'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should track outbound link click with custom label', () => {
      ;(import.meta.env as any).DEV = false

      trackOutboundLink('https://github.com', 'GitHub Profile')

      expect(gtagMock).toHaveBeenCalledWith('event', 'click', {
        event_category: 'outbound',
        event_label: 'GitHub Profile',
        value: 'https://github.com'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should use URL as label if no label provided', () => {
      ;(import.meta.env as any).DEV = false

      trackOutboundLink('https://linkedin.com/in/profile')

      expect(gtagMock).toHaveBeenCalledWith('event', 'click', {
        event_category: 'outbound',
        event_label: 'https://linkedin.com/in/profile',
        value: 'https://linkedin.com/in/profile'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })
  })

  describe('trackContact', () => {
    it('should track contact interaction with email', () => {
      ;(import.meta.env as any).DEV = false

      trackContact('email')

      expect(gtagMock).toHaveBeenCalledWith('event', 'contact', {
        method: 'email',
        event_category: 'engagement'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should track contact interaction with github', () => {
      ;(import.meta.env as any).DEV = false

      trackContact('github')

      expect(gtagMock).toHaveBeenCalledWith('event', 'contact', {
        method: 'github',
        event_category: 'engagement'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should track contact interaction with linkedin', () => {
      ;(import.meta.env as any).DEV = false

      trackContact('linkedin')

      expect(gtagMock).toHaveBeenCalledWith('event', 'contact', {
        method: 'linkedin',
        event_category: 'engagement'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should work with any contact method string', () => {
      ;(import.meta.env as any).DEV = false

      trackContact('phone')

      expect(gtagMock).toHaveBeenCalledWith('event', 'contact', {
        method: 'phone',
        event_category: 'engagement'
      })

      ;(import.meta.env as any).DEV = originalEnv
    })
  })

  describe('Error handling', () => {
    it('should handle window being undefined gracefully for trackEvent', () => {
      ;(import.meta.env as any).DEV = false
      const originalWindow = global.window

      // @ts-ignore
      delete global.window

      expect(() => trackEvent('test')).not.toThrow()

      // @ts-ignore
      global.window = originalWindow
      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should handle window being undefined gracefully for trackPageView', () => {
      ;(import.meta.env as any).DEV = false
      const originalWindow = global.window

      // @ts-ignore
      delete global.window

      expect(() => trackPageView()).not.toThrow()

      // @ts-ignore
      global.window = originalWindow
      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should handle window being undefined gracefully for trackOutboundLink', () => {
      ;(import.meta.env as any).DEV = false
      const originalWindow = global.window

      // @ts-ignore
      delete global.window

      expect(() => trackOutboundLink('https://test.com')).not.toThrow()

      // @ts-ignore
      global.window = originalWindow
      ;(import.meta.env as any).DEV = originalEnv
    })

    it('should handle window being undefined gracefully for trackContact', () => {
      ;(import.meta.env as any).DEV = false
      const originalWindow = global.window

      // @ts-ignore
      delete global.window

      expect(() => trackContact('email')).not.toThrow()

      // @ts-ignore
      global.window = originalWindow
      ;(import.meta.env as any).DEV = originalEnv
    })
  })
})
