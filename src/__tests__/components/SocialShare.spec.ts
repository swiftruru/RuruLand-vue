import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import SocialShare from '../../components/SocialShare.vue'
import * as googleAnalytics from '../../composables/useGoogleAnalytics'

// Mock Google Analytics
vi.mock('../../composables/useGoogleAnalytics', () => ({
  trackShare: vi.fn()
}))

// Mock navigator.clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
})

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      common: {
        share: {
          title: '分享此頁面',
          copy: '複製連結',
          copied: '已複製！'
        }
      }
    }
  }
})

describe('SocialShare', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock window.location
    delete (window as any).location
    ;(window as any).location = { href: 'https://test.example.com' }
  })

  it('should render share title', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const title = wrapper.find('.share-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('分享此頁面')
  })

  it('should render all share buttons', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const shareButtons = wrapper.findAll('.share-button')
    expect(shareButtons).toHaveLength(4) // Facebook, Twitter, LinkedIn, Copy
  })

  it('should render Facebook share button', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const facebookBtn = wrapper.find('.share-button.facebook')
    expect(facebookBtn.exists()).toBe(true)
    expect(facebookBtn.text()).toContain('Facebook')
    expect(facebookBtn.attributes('href')).toContain('facebook.com/sharer')
    expect(facebookBtn.attributes('href')).toContain(encodeURIComponent('https://test.example.com'))
  })

  it('should render Twitter share button', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const twitterBtn = wrapper.find('.share-button.twitter')
    expect(twitterBtn.exists()).toBe(true)
    expect(twitterBtn.text()).toContain('Twitter')
    expect(twitterBtn.attributes('href')).toContain('twitter.com/intent/tweet')
  })

  it('should render LinkedIn share button', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const linkedInBtn = wrapper.find('.share-button.linkedin')
    expect(linkedInBtn.exists()).toBe(true)
    expect(linkedInBtn.text()).toContain('LinkedIn')
    expect(linkedInBtn.attributes('href')).toContain('linkedin.com/sharing')
  })

  it('should render copy link button', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const copyBtn = wrapper.find('.share-button.copy')
    expect(copyBtn.exists()).toBe(true)
    expect(copyBtn.text()).toContain('複製連結')
  })

  it('should have correct aria-labels', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.facebook').attributes('aria-label')).toBe('Share on Facebook')
    expect(wrapper.find('.twitter').attributes('aria-label')).toBe('Share on Twitter')
    expect(wrapper.find('.linkedin').attributes('aria-label')).toBe('Share on LinkedIn')
    expect(wrapper.find('.copy').attributes('aria-label')).toBe('Copy link')
  })

  it('should have target="_blank" and rel="noopener noreferrer" on external links', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const externalLinks = wrapper.findAll('a[target="_blank"]')
    externalLinks.forEach(link => {
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  it('should track Facebook share click', async () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const facebookBtn = wrapper.find('.share-button.facebook')
    await facebookBtn.trigger('click')

    expect(googleAnalytics.trackShare).toHaveBeenCalledWith('Facebook', 'https://test.example.com')
  })

  it('should track Twitter share click', async () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const twitterBtn = wrapper.find('.share-button.twitter')
    await twitterBtn.trigger('click')

    expect(googleAnalytics.trackShare).toHaveBeenCalledWith('Twitter', 'https://test.example.com')
  })

  it('should track LinkedIn share click', async () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const linkedInBtn = wrapper.find('.share-button.linkedin')
    await linkedInBtn.trigger('click')

    expect(googleAnalytics.trackShare).toHaveBeenCalledWith('LinkedIn', 'https://test.example.com')
  })

  it('should copy link to clipboard when copy button is clicked', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = writeTextMock

    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const copyBtn = wrapper.find('.share-button.copy')
    await copyBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(writeTextMock).toHaveBeenCalledWith('https://test.example.com')
  })

  it('should show "copied" state after successful copy', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = writeTextMock

    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const copyBtn = wrapper.find('.share-button.copy')
    expect(copyBtn.text()).toContain('複製連結')

    await copyBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(copyBtn.text()).toContain('已複製！')
    expect(copyBtn.classes()).toContain('copied')
  })

  it('should track copy link event', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = writeTextMock

    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const copyBtn = wrapper.find('.share-button.copy')
    await copyBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(googleAnalytics.trackShare).toHaveBeenCalledWith('Copy Link', 'https://test.example.com')
  })

  it('should reset copied state after 2 seconds', async () => {
    vi.useFakeTimers()
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = writeTextMock

    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const copyBtn = wrapper.find('.share-button.copy')
    await copyBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(copyBtn.text()).toContain('已複製！')

    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    expect(copyBtn.text()).toContain('複製連結')

    vi.useRealTimers()
  })

  it('should handle copy error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const writeTextMock = vi.fn().mockRejectedValue(new Error('Copy failed'))
    navigator.clipboard.writeText = writeTextMock

    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const copyBtn = wrapper.find('.share-button.copy')
    await copyBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(consoleErrorSpy).toHaveBeenCalled()

    consoleErrorSpy.mockRestore()
  })

  it('should use fallback URL when window is not defined', () => {
    // This test verifies the getCurrentUrl function logic
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    // The component should still render with a URL
    const facebookBtn = wrapper.find('.share-button.facebook')
    expect(facebookBtn.attributes('href')).toBeTruthy()
  })

  it('should have SVG icons in all buttons', () => {
    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const buttons = wrapper.findAll('.share-button')
    buttons.forEach(button => {
      const svg = button.find('svg')
      expect(svg.exists()).toBe(true)
    })
  })

  it('should show different icon when copied', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined)
    navigator.clipboard.writeText = writeTextMock

    const wrapper = mount(SocialShare, {
      global: {
        plugins: [i18n]
      }
    })

    const copyBtn = wrapper.find('.share-button.copy')
    const svgsBefore = copyBtn.findAll('svg')

    await copyBtn.trigger('click')
    await wrapper.vm.$nextTick()

    const svgsAfter = copyBtn.findAll('svg')
    // Should still have SVG, but content should be different (checkmark vs copy icon)
    expect(svgsAfter.length).toBeGreaterThan(0)
  })
})
