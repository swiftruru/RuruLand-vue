import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ContactSection from '../../components/ContactSection.vue'
import * as googleAnalytics from '../../composables/useGoogleAnalytics'

// Mock Google Analytics
vi.mock('../../composables/useGoogleAnalytics', () => ({
  trackContact: vi.fn(),
  trackEvent: vi.fn()
}))

// Mock ContactForm component
vi.mock('../../components/ContactForm.vue', () => ({
  default: {
    name: 'ContactForm',
    template: '<div class="contact-form-mock">Contact Form</div>'
  }
}))

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      contact: {
        title: '聯絡我',
        intro: '歡迎與我聯絡',
        formIntro: '或填寫以下表單',
        email: {
          title: 'Email',
          address: "ruru{'@'}swift.moe"
        },
        phone: {
          title: '電話',
          number: '+886 977-006-588'
        },
        github: {
          title: 'GitHub',
          username: "{'@'}swiftruru"
        },
        cakeresume: {
          title: 'CakeResume',
          text: '查看我的履歷'
        },
        website: {
          title: '個人網站',
          url: 'swift.moe'
        },
        location: {
          title: '所在地',
          city: '台北市, 台灣'
        }
      },
      about: {
        resume: {
          print: '列印履歷'
        }
      }
    }
  }
})

describe('ContactSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render section with correct id', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const section = wrapper.find('section')
    expect(section.attributes('id')).toBe('contact')
    expect(section.classes()).toContain('contact')
  })

  it('should render section title', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const title = wrapper.find('.section-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('聯絡我')
  })

  it('should render intro text', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const intro = wrapper.find('.contact-intro')
    expect(intro.exists()).toBe(true)
    expect(intro.text()).toBe('歡迎與我聯絡')
  })

  it('should render all contact items', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const contactItems = wrapper.findAll('.contact-item')
    expect(contactItems).toHaveLength(6) // email, phone, github, cakeresume, website, location
  })

  it('should render email contact with correct link', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const emailLink = wrapper.find('a[href="mailto:ruru@swift.moe"]')
    expect(emailLink.exists()).toBe(true)
    expect(emailLink.text()).toBe('ruru@swift.moe')
  })

  it('should render phone contact with correct link', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const phoneLink = wrapper.find('a[href="tel:+886977006588"]')
    expect(phoneLink.exists()).toBe(true)
    expect(phoneLink.text()).toBe('+886 977-006-588')
  })

  it('should render GitHub link with correct attributes', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const githubLink = wrapper.find('a[href="https://github.com/swiftruru"]')
    expect(githubLink.exists()).toBe(true)
    expect(githubLink.attributes('target')).toBe('_blank')
    expect(githubLink.attributes('rel')).toBe('noopener noreferrer')
    expect(githubLink.text()).toBe('@swiftruru')
  })

  it('should render CakeResume link', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const cakeLink = wrapper.find('a[href*="cake.me"]')
    expect(cakeLink.exists()).toBe(true)
    expect(cakeLink.attributes('target')).toBe('_blank')
    expect(cakeLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('should render website link', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const websiteLink = wrapper.find('a[href="https://swift.moe"]')
    expect(websiteLink.exists()).toBe(true)
    expect(websiteLink.attributes('target')).toBe('_blank')
    expect(websiteLink.attributes('rel')).toBe('noopener noreferrer')
  })

  it('should render location without link', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('所在地')
    expect(wrapper.text()).toContain('台北市, 台灣')
  })

  it('should track email click', async () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const emailLink = wrapper.find('a[href="mailto:ruru@swift.moe"]')
    await emailLink.trigger('click')

    expect(googleAnalytics.trackContact).toHaveBeenCalledWith('email')
  })

  it('should track phone click', async () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const phoneLink = wrapper.find('a[href="tel:+886977006588"]')
    await phoneLink.trigger('click')

    expect(googleAnalytics.trackContact).toHaveBeenCalledWith('phone')
  })

  it('should track GitHub click', async () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const githubLink = wrapper.find('a[href="https://github.com/swiftruru"]')
    await githubLink.trigger('click')

    expect(googleAnalytics.trackContact).toHaveBeenCalledWith('github')
  })

  it('should track CakeResume click', async () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const cakeLink = wrapper.find('a[href*="cake.me"]')
    await cakeLink.trigger('click')

    expect(googleAnalytics.trackContact).toHaveBeenCalledWith('cakeresume')
  })

  it('should track website click', async () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const websiteLink = wrapper.find('a[href="https://swift.moe"]')
    await websiteLink.trigger('click')

    expect(googleAnalytics.trackContact).toHaveBeenCalledWith('website')
  })

  it('should render ContactForm component', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.contact-form-mock').exists()).toBe(true)
  })

  it('should render form intro text', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const formIntro = wrapper.find('.contact-form-intro')
    expect(formIntro.exists()).toBe(true)
    expect(formIntro.text()).toBe('或填寫以下表單')
  })

  it('should render print resume button', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const printBtn = wrapper.find('.print-resume-btn')
    expect(printBtn.exists()).toBe(true)
    expect(printBtn.text()).toBe('列印履歷')
  })

  it('should call window.print when print button is clicked', async () => {
    const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const printBtn = wrapper.find('.print-resume-btn')
    await printBtn.trigger('click')

    expect(printSpy).toHaveBeenCalled()
    expect(googleAnalytics.trackEvent).toHaveBeenCalledWith('resume_print', {
      source: 'contact_section'
    })

    printSpy.mockRestore()
  })

  it('should have animation classes', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.fade-up').exists()).toBe(true)
  })

  it('should have correct delay classes for contact items', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.delay-100').exists()).toBe(true)
    expect(wrapper.find('.delay-200').exists()).toBe(true)
    expect(wrapper.find('.delay-300').exists()).toBe(true)
    expect(wrapper.find('.delay-400').exists()).toBe(true)
    expect(wrapper.find('.delay-500').exists()).toBe(true)
  })

  it('should have contact-grid structure', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.contact-grid').exists()).toBe(true)
    expect(wrapper.find('.resume-actions').exists()).toBe(true)
  })

  it('should have correct aria-label on print button', () => {
    const wrapper = mount(ContactSection, {
      global: {
        plugins: [i18n]
      }
    })

    const printBtn = wrapper.find('.print-resume-btn')
    expect(printBtn.attributes('aria-label')).toBe('列印履歷')
  })
})
