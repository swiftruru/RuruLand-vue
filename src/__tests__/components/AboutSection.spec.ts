import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import AboutSection from '../../components/AboutSection.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      about: {
        title: '關於我',
        intro: '我是一名全端開發者',
        skills: {
          backend: '後端技術',
          frontend: '前端技術',
          tools: '開發工具',
          experience: '專業認證與經驗'
        },
        experienceList: {
          exp1: '2+ 年金流系統開發經驗',
          exp2: '協助取得 PCI DSS 4.0 國際認證',
          exp3: '熟悉雲端部署與 CI/CD 流程',
          exp4: '具備系統優化與效能調校經驗'
        }
      }
    },
    'en': {
      about: {
        title: 'About Me',
        intro: 'I am a full-stack developer',
        skills: {
          backend: 'Backend Technologies',
          frontend: 'Frontend Technologies',
          tools: 'Development Tools',
          experience: 'Professional Certifications & Experience'
        },
        experienceList: {
          exp1: '2+ years of payment system development experience',
          exp2: 'Helped obtain PCI DSS 4.0 international certification',
          exp3: 'Familiar with cloud deployment and CI/CD processes',
          exp4: 'Experience in system optimization and performance tuning'
        }
      }
    }
  }
})

describe('AboutSection', () => {
  it('should render section with correct id', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    const section = wrapper.find('section')
    expect(section.attributes('id')).toBe('about')
    expect(section.classes()).toContain('about')
  })

  it('should render section title', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    const title = wrapper.find('.section-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('關於我')
  })

  it('should render intro text', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    const intro = wrapper.find('.intro-text')
    expect(intro.exists()).toBe(true)
    expect(intro.text()).toBe('我是一名全端開發者')
  })

  it('should render all skill categories', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    const categories = wrapper.findAll('.skill-category')
    expect(categories).toHaveLength(4)
  })

  it('should render backend technologies', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('後端技術')
    expect(wrapper.text()).toContain('.NET Framework')
    expect(wrapper.text()).toContain('ASP.NET MVC')
    expect(wrapper.text()).toContain('.NET Core')
    expect(wrapper.text()).toContain('C#')
    expect(wrapper.text()).toContain('Python')
    expect(wrapper.text()).toContain('Django')
  })

  it('should render frontend technologies', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('前端技術')
    expect(wrapper.text()).toContain('Vue.js')
    expect(wrapper.text()).toContain('JavaScript')
    expect(wrapper.text()).toContain('HTML5')
    expect(wrapper.text()).toContain('CSS3')
    expect(wrapper.text()).toContain('Sass')
  })

  it('should render development tools', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('開發工具')
    expect(wrapper.text()).toContain('Git')
    expect(wrapper.text()).toContain('Azure DevOps')
    expect(wrapper.text()).toContain('GCP')
    expect(wrapper.text()).toContain('Docker')
    expect(wrapper.text()).toContain('PostgreSQL')
    expect(wrapper.text()).toContain('SQL Server')
  })

  it('should render experience list', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('專業認證與經驗')
    expect(wrapper.text()).toContain('2+ 年金流系統開發經驗')
    expect(wrapper.text()).toContain('協助取得 PCI DSS 4.0 國際認證')
    expect(wrapper.text()).toContain('熟悉雲端部署與 CI/CD 流程')
    expect(wrapper.text()).toContain('具備系統優化與效能調校經驗')
  })

  it('should have correct number of tech tags', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    const techTags = wrapper.findAll('.tech-tag')
    // Backend (6) + Frontend (5) + Tools (6) = 17
    expect(techTags).toHaveLength(17)
  })

  it('should have animation classes', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.fade-up').exists()).toBe(true)
    expect(wrapper.find('.fade-left').exists()).toBe(true)
    expect(wrapper.find('.fade-right').exists()).toBe(true)
  })

  it('should have correct delay classes', () => {
    const wrapper = mount(AboutSection, {
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

  it('should render with English locale', async () => {
    i18n.global.locale.value = 'en'

    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    const title = wrapper.find('.section-title')
    const intro = wrapper.find('.intro-text')

    expect(title.text()).toBe('About Me')
    expect(intro.text()).toBe('I am a full-stack developer')
    expect(wrapper.text()).toContain('Backend Technologies')
    expect(wrapper.text()).toContain('Frontend Technologies')
    expect(wrapper.text()).toContain('Development Tools')
    expect(wrapper.text()).toContain('Professional Certifications & Experience')

    // Reset locale
    i18n.global.locale.value = 'zh-TW'
  })

  it('should have experience list as ul element', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    const experienceList = wrapper.find('.experience-list')
    expect(experienceList.exists()).toBe(true)
    expect(experienceList.element.tagName).toBe('UL')

    const listItems = experienceList.findAll('li')
    expect(listItems).toHaveLength(4)
  })

  it('should have container and about-content structure', () => {
    const wrapper = mount(AboutSection, {
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.container').exists()).toBe(true)
    expect(wrapper.find('.about-content').exists()).toBe(true)
    expect(wrapper.find('.about-intro').exists()).toBe(true)
    expect(wrapper.find('.skills-section').exists()).toBe(true)
  })
})
