import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import PhotoModal from '../../components/PhotoModal.vue'

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  messages: {
    'zh-TW': {
      common: {
        modal: {
          imageAlt: '放大檢視',
          hint: '點擊背景或按 ESC 關閉'
        }
      }
    },
    'en': {
      common: {
        modal: {
          imageAlt: 'Enlarged view',
          hint: 'Click background or press ESC to close'
        }
      }
    }
  }
})

describe('PhotoModal', () => {
  const defaultProps = {
    isOpen: false,
    imageSrc: '/test-image.jpg'
  }

  beforeEach(() => {
    // Reset any global state if needed
  })

  it('should render modal with correct structure', () => {
    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.photo-modal').exists()).toBe(true)
    expect(wrapper.find('.modal-content').exists()).toBe(true)
    expect(wrapper.find('.close-modal').exists()).toBe(true)
    expect(wrapper.find('.modal-image').exists()).toBe(true)
    expect(wrapper.find('.modal-hint').exists()).toBe(true)
  })

  it('should not have active class when isOpen is false', () => {
    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.photo-modal').classes()).not.toContain('active')
  })

  it('should have active class when isOpen is true', () => {
    const wrapper = mount(PhotoModal, {
      props: {
        ...defaultProps,
        isOpen: true
      },
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.photo-modal').classes()).toContain('active')
  })

  it('should display correct image src', () => {
    const wrapper = mount(PhotoModal, {
      props: {
        ...defaultProps,
        imageSrc: '/custom-image.jpg'
      },
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.modal-image')
    expect(img.attributes('src')).toBe('/custom-image.jpg')
  })

  it('should display correct image alt text', () => {
    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.modal-image')
    expect(img.attributes('alt')).toBe('放大檢視')
  })

  it('should display hint text', () => {
    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    const hint = wrapper.find('.modal-hint')
    expect(hint.text()).toBe('點擊背景或按 ESC 關閉')
  })

  it('should emit close event when close button is clicked', async () => {
    const wrapper = mount(PhotoModal, {
      props: {
        ...defaultProps,
        isOpen: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const closeButton = wrapper.find('.close-modal')
    await closeButton.trigger('click')

    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('should emit close event when modal background is clicked', async () => {
    const wrapper = mount(PhotoModal, {
      props: {
        ...defaultProps,
        isOpen: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const modal = wrapper.find('.photo-modal')
    await modal.trigger('click.self')

    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('should not emit close event when modal content is clicked', async () => {
    const wrapper = mount(PhotoModal, {
      props: {
        ...defaultProps,
        isOpen: true
      },
      global: {
        plugins: [i18n]
      }
    })

    const modalContent = wrapper.find('.modal-content')
    await modalContent.trigger('click')

    expect(wrapper.emitted('close')).toBeFalsy()
  })

  it('should update when props change', async () => {
    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    expect(wrapper.find('.photo-modal').classes()).not.toContain('active')

    await wrapper.setProps({ isOpen: true })
    expect(wrapper.find('.photo-modal').classes()).toContain('active')

    await wrapper.setProps({ isOpen: false })
    expect(wrapper.find('.photo-modal').classes()).not.toContain('active')
  })

  it('should update image when imageSrc prop changes', async () => {
    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.modal-image')
    expect(img.attributes('src')).toBe('/test-image.jpg')

    await wrapper.setProps({ imageSrc: '/new-image.jpg' })
    expect(img.attributes('src')).toBe('/new-image.jpg')
  })

  it('should render with English locale', async () => {
    i18n.global.locale.value = 'en'

    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    const img = wrapper.find('.modal-image')
    const hint = wrapper.find('.modal-hint')

    expect(img.attributes('alt')).toBe('Enlarged view')
    expect(hint.text()).toBe('Click background or press ESC to close')

    // Reset locale
    i18n.global.locale.value = 'zh-TW'
  })

  it('should have correct close button symbol', () => {
    const wrapper = mount(PhotoModal, {
      props: defaultProps,
      global: {
        plugins: [i18n]
      }
    })

    const closeButton = wrapper.find('.close-modal')
    expect(closeButton.text()).toBe('×')
  })
})
