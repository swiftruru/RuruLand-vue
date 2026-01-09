import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import HeroSection from '../../components/HeroSection.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      common: {
        hero: {
          name: '潘昱如',
          nameEn: 'Yu-Ru Pan',
          title: 'Full Stack Developer',
          subtitle: '專注於現代網頁開發與系統優化',
          aboutMe: '關於我',
          viewProjects: '查看作品'
        }
      }
    },
    'en': {
      common: {
        hero: {
          name: 'Ruru Pan',
          nameEn: 'Yu-Ru Pan',
          title: 'Full Stack Developer',
          subtitle: 'Focus on modern web development and system optimization',
          aboutMe: 'About Me',
          viewProjects: 'View Projects'
        }
      }
    }
  }
})

describe('HeroSection', () => {
  it('should render hero content correctly', () => {
    const wrapper = mount(HeroSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('潘昱如')
    expect(wrapper.text()).toContain('Yu-Ru Pan')
    expect(wrapper.text()).toContain('Full Stack Developer')
  })

  it('should render profile image', () => {
    const wrapper = mount(HeroSection, {
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.profile-photo')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toContain('潘昱如')
  })

  it('should emit openPhotoModal when image is clicked', async () => {
    const wrapper = mount(HeroSection, {
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.profile-photo')
    await img.trigger('click')

    expect(wrapper.emitted('openPhotoModal')).toBeTruthy()
    expect(wrapper.emitted('openPhotoModal')?.[0]).toBeTruthy()
  })

  it('should render action buttons', () => {
    const wrapper = mount(HeroSection, {
      global: {
        plugins: [i18n]
      }
    })

    const buttons = wrapper.findAll('.btn')
    expect(buttons.length).toBe(2)

    const aboutBtn = buttons[0]
    const projectsBtn = buttons[1]

    expect(aboutBtn.text()).toBe('關於我')
    expect(aboutBtn.attributes('href')).toBe('#about')

    expect(projectsBtn.text()).toBe('查看作品')
    expect(projectsBtn.attributes('href')).toBe('#projects')
  })

  it('should have animation classes', () => {
    const wrapper = mount(HeroSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.zoom-in').exists()).toBe(true)
    expect(wrapper.find('.fade-up').exists()).toBe(true)
  })

  it('should render with English locale', async () => {
    const wrapper = mount(HeroSection, {
      global: {
        plugins: [i18n]
      }
    })

    i18n.global.locale.value = 'en'
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('About Me')
    expect(wrapper.text()).toContain('View Projects')
  })
})
