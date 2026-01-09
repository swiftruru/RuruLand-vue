import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import App from '../../App.vue'

// Mock composables
vi.mock('../../composables/useScrollAnimation', () => ({
  useScrollAnimation: () => ({
    smoothScrollTo: vi.fn()
  })
}))

vi.mock('../../composables/useCursorEffect', () => ({
  useCursorEffect: vi.fn()
}))

vi.mock('../../composables/useGoogleAnalytics', () => ({
  useGoogleAnalytics: vi.fn(),
  trackEvent: vi.fn()
}))

vi.mock('../../composables/useLazyLoad', () => ({
  useLazyLoad: vi.fn()
}))

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      common: {
        accessibility: {
          skipToMain: '跳至主要內容'
        },
        hero: {
          name: '潘昱如',
          nameEn: 'Yu-Ru Pan',
          title: 'Full Stack Developer',
          subtitle: '專注於現代網頁開發與系統優化',
          aboutMe: '關於我',
          viewProjects: '查看作品'
        },
        nav: {
          home: '首頁',
          about: '關於我',
          timeline: '職涯歷程',
          projects: '作品集',
          contact: '聯絡我'
        },
        footer: {
          copyright: '© 2026 Ruru Pan. All rights reserved.',
          madeWith: 'Made with ❤️ using Vue 3 + TypeScript'
        },
        modal: {
          imageAlt: '放大圖片',
          hint: '點擊關閉'
        },
        share: {
          title: '分享',
          copy: '複製連結'
        }
      },
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
        },
        resume: {
          print: '列印履歷'
        }
      },
      timeline: {
        title: '職涯歷程',
        workExperience: {
          title: '工作經歷',
          job1: {
            title: '全端工程師',
            company: '某科技公司',
            period: '2022 - 現在'
          },
          job2: {
            title: '前端工程師',
            company: '某新創公司',
            period: '2020 - 2022'
          },
          job3: {
            title: '初級工程師',
            company: '某公司',
            period: '2019 - 2020'
          }
        },
        education: {
          title: '教育背景',
          master: {
            degree: '資訊工程碩士',
            school: '某大學',
            period: '2017 - 2019',
            status: '已畢業'
          },
          buildSchool: {
            title: 'Build School',
            period: '2018'
          }
        },
        certifications: {
          title: '專業認證'
        }
      },
      projects: {
        title: '作品集',
        techStack: '技術棧',
        highlights: '專案亮點',
        viewDetails: '查看詳情',
        viewWebsite: '查看網站',
        challenge: '專案挑戰',
        problem: '問題描述',
        solution: '解決方案',
        clickToEnlarge: '點擊放大',
        about: '關於專案',
        perfume: {
          title: '香水電商平台',
          url: 'https://perfume.example.com',
          description: '香水電商平台描述',
          responsibilities: {
            title: '工作職責',
            item1: '職責1',
            item2: '職責2',
            item3: '職責3',
            item4: '職責4'
          },
          techStack: {
            tech1: 'Vue 3',
            tech2: 'TypeScript',
            tech3: 'Pinia',
            tech4: 'Vite',
            tech5: 'Tailwind CSS',
            tech6: 'REST API',
            tech7: 'Docker'
          }
        },
        django: {
          title: 'Django 後台系統',
          url: 'https://django.example.com',
          description: 'Django 後台系統描述',
          features: {
            title: '主要功能',
            item1: '功能1',
            item2: '功能2',
            item3: '功能3',
            item4: '功能4'
          },
          techStack: {
            tech1: 'Django',
            tech2: 'Python',
            tech3: 'PostgreSQL',
            tech4: 'Redis',
            tech5: 'Celery'
          },
          highlights: {
            item1: '亮點1',
            item2: '亮點2',
            item3: '亮點3'
          }
        }
      },
      contact: {
        title: '聯絡我',
        intro: '歡迎與我聯繫',
        email: {
          title: 'Email',
          address: "ruru{'@'}swift.moe"
        },
        phone: {
          title: '電話',
          number: '+886 977 006 588'
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
          title: '地點',
          city: '台灣 台北'
        },
        formIntro: '或填寫以下表單',
        form: {
          name: '姓名',
          namePlaceholder: '請輸入您的姓名',
          email: 'Email',
          emailPlaceholder: '請輸入您的 Email',
          subject: '主旨',
          subjectPlaceholder: '請輸入主旨',
          message: '訊息',
          messagePlaceholder: '請輸入您的訊息',
          send: '送出',
          submit: '送出',
          sending: '傳送中...',
          success: '訊息已成功送出！',
          error: '傳送失敗，請稍後再試'
        },
        floatingButton: '聯絡我'
      }
    }
  }
})

describe('App Integration Tests', () => {
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    pinia = createPinia()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render main application structure', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          ReadingProgress: true,
          NavigationBar: true,
          HeroSection: true,
          AboutSection: true,
          TimelineSection: true,
          ProjectsSection: true,
          ContactSection: true,
          PhotoModal: true,
          PageLoader: true,
          SocialShare: true,
          ProjectDetailModal: true,
          AccessibilityControls: true,
          SkeletonLoader: true,
          FloatingContactButton: true
        }
      }
    })

    // 等待初始載入
    vi.advanceTimersByTime(500)
    await flushPromises()

    expect(wrapper.find('#app').exists()).toBe(true)
    expect(wrapper.find('#main-content').exists()).toBe(true)
  })

  it('should show skeleton loader initially', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          SkeletonLoader: false
        }
      }
    })

    expect(wrapper.findComponent({ name: 'SkeletonLoader' }).exists()).toBe(true)
  })

  it('should hide skeleton loader after loading', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    // 初始狀態應該顯示骨架屏
    expect(wrapper.vm.isLoading).toBe(true)

    // 等待載入時間
    vi.advanceTimersByTime(500)
    await flushPromises()

    expect(wrapper.vm.isLoading).toBe(false)
  })

  it('should render skip link for accessibility', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    const skipLink = wrapper.find('.skip-link')
    expect(skipLink.exists()).toBe(true)
    expect(skipLink.attributes('href')).toBe('#main-content')
    expect(skipLink.text()).toBe('跳至主要內容')
  })

  it('should render all main sections', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          HeroSection: { template: '<section id="hero">Hero</section>' },
          AboutSection: { template: '<section id="about">About</section>' },
          TimelineSection: { template: '<section id="timeline">Timeline</section>' },
          ProjectsSection: { template: '<section id="projects">Projects</section>' },
          ContactSection: { template: '<section id="contact">Contact</section>' }
        }
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    expect(wrapper.text()).toContain('Hero')
    expect(wrapper.text()).toContain('About')
    expect(wrapper.text()).toContain('Timeline')
    expect(wrapper.text()).toContain('Projects')
    expect(wrapper.text()).toContain('Contact')
  })

  it('should render footer with copyright', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
    expect(footer.text()).toContain('© 2026 Ruru Pan. All rights reserved.')
  })

  it('should handle photo modal open and close', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          PhotoModal: {
            template: '<div v-if="isOpen" class="photo-modal">Modal</div>',
            props: ['isOpen', 'imageSrc']
          }
        }
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    // 初始狀態 modal 應該關閉
    expect(wrapper.vm.isModalOpen).toBe(false)

    // 打開 modal
    await wrapper.vm.openPhotoModal('/test-image.jpg')
    expect(wrapper.vm.isModalOpen).toBe(true)
    expect(wrapper.vm.currentImage).toBe('/test-image.jpg')

    // 關閉 modal
    await wrapper.vm.closeModal()
    expect(wrapper.vm.isModalOpen).toBe(false)
  })

  it('should handle project detail modal open and close', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    const mockProject = {
      title: 'Test Project',
      description: 'Test Description'
    }

    // 初始狀態 modal 應該關閉
    expect(wrapper.vm.isProjectDetailOpen).toBe(false)

    // 打開 modal
    await wrapper.vm.openProjectDetail(mockProject)
    expect(wrapper.vm.isProjectDetailOpen).toBe(true)
    expect(wrapper.vm.currentProject).toEqual(mockProject)

    // 關閉 modal
    wrapper.vm.closeProjectDetail()
    expect(wrapper.vm.isProjectDetailOpen).toBe(false)

    // 等待清理 timeout
    vi.advanceTimersByTime(300)
    await flushPromises()
    expect(wrapper.vm.currentProject).toBe(null)
  })

  it('should have proper semantic HTML structure', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    // 檢查語義化標籤
    expect(wrapper.find('main[role="main"]').exists()).toBe(true)
    expect(wrapper.find('footer[role="contentinfo"]').exists()).toBe(true)
  })

  it('should apply fade-in animation to app content', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia]
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    const appContent = wrapper.find('.app-content')
    expect(appContent.exists()).toBe(true)
  })

  it('should render all utility components', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [i18n, pinia],
        stubs: {
          ReadingProgress: { template: '<div class="reading-progress">Progress</div>' },
          PageLoader: { template: '<div class="page-loader">Loader</div>' },
          AccessibilityControls: { template: '<div class="a11y-controls">A11y</div>' },
          FloatingContactButton: { template: '<div class="floating-btn">Contact</div>' }
        }
      }
    })

    vi.advanceTimersByTime(500)
    await flushPromises()

    expect(wrapper.find('.reading-progress').exists()).toBe(true)
    expect(wrapper.find('.page-loader').exists()).toBe(true)
    expect(wrapper.find('.a11y-controls').exists()).toBe(true)
    expect(wrapper.find('.floating-btn').exists()).toBe(true)
  })
})
