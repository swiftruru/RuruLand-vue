import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ProjectDetailModal from '../../components/ProjectDetailModal.vue'
import * as googleAnalytics from '../../composables/useGoogleAnalytics'

// Mock Google Analytics
vi.mock('../../composables/useGoogleAnalytics', () => ({
  trackEvent: vi.fn()
}))

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      projects: {
        viewWebsite: '查看網站',
        clickToEnlarge: '點擊圖片放大',
        about: '關於專案',
        highlights: '專案亮點',
        challengesAndSolutions: '技術挑戰與解決方案',
        techStack: '使用技術'
      }
    }
  }
})

const mockProject = {
  title: 'Test Project',
  url: 'example.com',
  image: '/test-image.jpg',
  description: 'This is a test project description',
  sectionTitle: 'Core Features',
  items: ['Feature 1', 'Feature 2', 'Feature 3'],
  techStack: ['Vue.js', 'TypeScript', 'Vite'],
  highlights: ['Highlight 1', 'Highlight 2'],
  challenges: [
    {
      challenge: 'Challenge 1',
      solution: 'Solution 1'
    }
  ]
}

describe('ProjectDetailModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: false,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.project-detail-modal').exists()).toBe(false)
  })

  it('should render when isOpen is true', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.project-detail-modal').exists()).toBe(true)
  })

  it('should render project title', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const title = wrapper.find('.detail-title')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Test Project')
  })

  it('should render project link with https protocol', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const link = wrapper.find('.detail-link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })

  it('should render project image', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.detail-image')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/test-image.jpg')
    expect(img.attributes('alt')).toBe('Test Project')
  })

  it('should emit openPhotoModal when image is clicked', async () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.detail-image')
    await img.trigger('click')

    expect(wrapper.emitted('openPhotoModal')).toBeTruthy()
    expect(wrapper.emitted('openPhotoModal')?.[0]).toEqual(['/test-image.jpg'])
  })

  it('should render project description', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const description = wrapper.find('.detail-description')
    expect(description.exists()).toBe(true)
    expect(description.text()).toBe('This is a test project description')
  })

  it('should render project items list', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const listItems = wrapper.findAll('.detail-list-item')
    expect(listItems).toHaveLength(3)
    expect(listItems[0].text()).toBe('Feature 1')
    expect(listItems[1].text()).toBe('Feature 2')
    expect(listItems[2].text()).toBe('Feature 3')
  })

  it('should render highlights when provided', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('專案亮點')
    const highlights = wrapper.findAll('.highlight-card')
    expect(highlights).toHaveLength(2)
  })

  it('should not render highlights section when not provided', () => {
    const projectWithoutHighlights = { ...mockProject, highlights: undefined }

    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: projectWithoutHighlights
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.findAll('.highlight-card')).toHaveLength(0)
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const closeButton = wrapper.find('.modal-close')
    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should emit close event when backdrop is clicked', async () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const backdrop = wrapper.find('.project-detail-modal')
    await backdrop.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should not emit close when modal content is clicked', async () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const modalContent = wrapper.find('.modal-content')
    await modalContent.trigger('click')

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should track project view when link is clicked', async () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const link = wrapper.find('.detail-link')
    await link.trigger('click')

    expect(googleAnalytics.trackEvent).toHaveBeenCalledWith('project_view', {
      project_name: 'Test Project',
      project_url: 'example.com'
    })
  })

  it('should handle null project gracefully', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: null
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.detail-container').exists()).toBe(false)
  })

  it('should have transition name', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: false,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.html()).toContain('modal-fade')
  })

  it('should render close button with aria-label', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const closeButton = wrapper.find('.modal-close')
    expect(closeButton.attributes('aria-label')).toBe('Close modal')
  })

  it('should render image hint text', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const hint = wrapper.find('.image-hint')
    expect(hint.exists()).toBe(true)
    expect(hint.text()).toBe('點擊圖片放大')
  })

  it('should render section headings', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('關於專案')
    expect(wrapper.text()).toContain('Core Features')
    expect(wrapper.text()).toContain('專案亮點')
  })

  it('should add https:// to URL without protocol', () => {
    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const link = wrapper.find('.detail-link')
    expect(link.attributes('href')).toBe('https://example.com')
  })

  it('should preserve URL with existing https:// protocol', () => {
    const projectWithHttps = {
      ...mockProject,
      url: 'https://secure-example.com'
    }

    const wrapper = mount(ProjectDetailModal, {
      props: {
        isOpen: true,
        project: projectWithHttps
      },
      global: {
        plugins: [i18n]
      }
    })

    const link = wrapper.find('.detail-link')
    expect(link.attributes('href')).toBe('https://secure-example.com')
  })
})
