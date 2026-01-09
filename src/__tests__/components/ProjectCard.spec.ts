import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import ProjectCard from '../../components/ProjectCard.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      projects: {
        viewWebsite: '查看網站',
        techStack: '技術棧',
        highlights: '專案亮點',
        viewDetails: '查看詳情'
      }
    },
    'en': {
      projects: {
        viewWebsite: 'View Website',
        techStack: 'Tech Stack',
        highlights: 'Highlights',
        viewDetails: 'View Details'
      }
    }
  }
})

const mockProject = {
  title: 'Test Project',
  url: 'example.com',
  image: '/images/test.jpg',
  description: 'This is a test project',
  sectionTitle: 'Features',
  items: ['Feature 1', 'Feature 2', 'Feature 3'],
  techStack: ['Vue.js', 'TypeScript', 'Vite'],
  highlights: ['Highlight 1', 'Highlight 2']
}

describe('ProjectCard', () => {
  it('should render project information correctly', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('Test Project')
    expect(wrapper.text()).toContain('This is a test project')
    expect(wrapper.text()).toContain('Features')
  })

  it('should render project image', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Test Project')
  })

  it('should emit openPhotoModal when image is clicked', async () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('img')
    await img.trigger('click')

    expect(wrapper.emitted('openPhotoModal')).toBeTruthy()
    expect(wrapper.emitted('openPhotoModal')?.[0]).toEqual(['/images/test.jpg'])
  })

  it('should render tech stack tags', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const techTags = wrapper.findAll('.tech-tag')
    expect(techTags.length).toBe(3)
    expect(techTags[0].text()).toBe('Vue.js')
    expect(techTags[1].text()).toBe('TypeScript')
    expect(techTags[2].text()).toBe('Vite')
  })

  it('should render feature items', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('Feature 1')
    expect(wrapper.text()).toContain('Feature 2')
    expect(wrapper.text()).toContain('Feature 3')
  })

  it('should render highlights when provided', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.text()).toContain('專案亮點')
    expect(wrapper.text()).toContain('Highlight 1')
    expect(wrapper.text()).toContain('Highlight 2')
  })

  it('should not render highlights section when not provided', () => {
    const projectWithoutHighlights = { ...mockProject, highlights: undefined }
    const wrapper = mount(ProjectCard, {
      props: {
        project: projectWithoutHighlights
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.highlight-section').exists()).toBe(false)
  })

  it('should emit openDetailModal when detail button is clicked', async () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const detailBtn = wrapper.find('.project-detail-btn')
    await detailBtn.trigger('click')

    expect(wrapper.emitted('openDetailModal')).toBeTruthy()
    expect(wrapper.emitted('openDetailModal')?.[0]).toEqual([mockProject])
  })

  it('should render project URL with correct link', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const links = wrapper.findAll('a[target="_blank"]')
    expect(links.length).toBeGreaterThan(0)

    const projectLink = links.find(link => link.classes('project-link'))
    expect(projectLink).toBeTruthy()
    expect(projectLink?.attributes('href')).toBe('https://example.com')
  })

  it('should add https:// protocol to URL without protocol', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const projectLink = wrapper.find('.project-link')
    expect(projectLink.attributes('href')).toBe('https://example.com')
  })

  it('should preserve URL with existing protocol', () => {
    const projectWithHttps = {
      ...mockProject,
      url: 'https://example.com'
    }

    const wrapper = mount(ProjectCard, {
      props: {
        project: projectWithHttps
      },
      global: {
        plugins: [i18n]
      }
    })

    const projectLink = wrapper.find('.project-link')
    expect(projectLink.attributes('href')).toBe('https://example.com')
  })

  it('should have rel="noopener noreferrer" on external links', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: mockProject
      },
      global: {
        plugins: [i18n]
      }
    })

    const externalLinks = wrapper.findAll('a[target="_blank"]')
    externalLinks.forEach(link => {
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })
  })
})
