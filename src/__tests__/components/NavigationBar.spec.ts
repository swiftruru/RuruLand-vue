import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import NavigationBar from '../../components/NavigationBar.vue'

// 創建 i18n 實例用於測試
const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      common: {
        nav: {
          home: '首頁',
          about: '關於我',
          timeline: '職涯歷程',
          projects: '作品集',
          contact: '聯絡我'
        }
      }
    },
    'en': {
      common: {
        nav: {
          home: 'Home',
          about: 'About',
          timeline: 'Career Timeline',
          projects: 'Projects',
          contact: 'Contact'
        }
      }
    }
  }
})

describe('NavigationBar', () => {
  it('should render navigation items', () => {
    const wrapper = mount(NavigationBar, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('首頁')
    expect(wrapper.text()).toContain('關於我')
    expect(wrapper.text()).toContain('職涯歷程')
    expect(wrapper.text()).toContain('作品集')
    expect(wrapper.text()).toContain('聯絡我')
  })

  it('should have correct navigation links', () => {
    const wrapper = mount(NavigationBar, {
      global: {
        plugins: [i18n]
      }
    })

    const links = wrapper.findAll('a')
    expect(links.length).toBeGreaterThan(0)

    const homeLink = links.find(link => link.attributes('href') === '#home')
    expect(homeLink).toBeTruthy()
  })

  it('should have language switcher button', () => {
    const wrapper = mount(NavigationBar, {
      global: {
        plugins: [i18n]
      }
    })

    const langButton = wrapper.find('.lang-switch')
    expect(langButton.exists()).toBe(true)
  })

  it('should toggle menu when hamburger is clicked', async () => {
    const wrapper = mount(NavigationBar, {
      global: {
        plugins: [i18n]
      }
    })

    const hamburger = wrapper.find('.hamburger')
    expect(hamburger.exists()).toBe(true)

    // 點擊 hamburger
    await hamburger.trigger('click')

    // 檢查 menu 是否被切換
    const nav = wrapper.find('nav')
    expect(nav.classes()).toContain('active')
  })
})
