import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { usePhotoModal } from '../../composables/usePhotoModal'

describe('usePhotoModal', () => {
  it('should initialize with modal closed', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    expect(vm.isModalOpen).toBe(false)
    expect(vm.currentImage).toBe('')
  })

  it('should open modal with image', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any
    const testImage = '/test/image.jpg'

    vm.openModal(testImage)

    expect(vm.isModalOpen).toBe(true)
    expect(vm.currentImage).toBe(testImage)
  })

  it('should close modal and clear image', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/test/image.jpg')
    expect(vm.isModalOpen).toBe(true)

    vm.closeModal()
    expect(vm.isModalOpen).toBe(false)
    expect(vm.currentImage).toBe('')
  })

  it('should prevent body scroll when modal opens', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/test/image.jpg')
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
  })

  it('should restore body scroll when modal closes', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/test/image.jpg')
    expect(document.body.style.overflow).toBe('hidden')

    vm.closeModal()
    expect(document.body.style.overflow).toBe('')

    wrapper.unmount()
  })

  it('should close modal on Escape key press', async () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/test/image.jpg')
    expect(vm.isModalOpen).toBe(true)

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(escapeEvent)
    await wrapper.vm.$nextTick()

    expect(vm.isModalOpen).toBe(false)

    wrapper.unmount()
  })

  it('should not close modal on other key press', async () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/test/image.jpg')

    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' })
    document.dispatchEvent(enterEvent)
    await wrapper.vm.$nextTick()

    expect(vm.isModalOpen).toBe(true)

    wrapper.unmount()
  })

  it('should not close on Escape if modal already closed', async () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
    document.dispatchEvent(escapeEvent)
    await wrapper.vm.$nextTick()

    expect(vm.isModalOpen).toBe(false)

    wrapper.unmount()
  })

  it('should add keydown listener on mount', () => {
    const spy = vi.spyOn(document, 'addEventListener')
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function))

    wrapper.unmount()
    spy.mockRestore()
  })

  it('should remove keydown listener on unmount', () => {
    const spy = vi.spyOn(document, 'removeEventListener')
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    wrapper.unmount()

    expect(spy).toHaveBeenCalledWith('keydown', expect.any(Function))
    spy.mockRestore()
  })

  it('should reset body overflow on unmount', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/test/image.jpg')
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('should handle multiple open/close cycles', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/image1.jpg')
    expect(vm.currentImage).toBe('/image1.jpg')
    vm.closeModal()

    vm.openModal('/image2.jpg')
    expect(vm.currentImage).toBe('/image2.jpg')
    vm.closeModal()

    wrapper.unmount()
  })

  it('should handle empty image path', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('')
    expect(vm.isModalOpen).toBe(true)
    expect(vm.currentImage).toBe('')

    wrapper.unmount()
  })

  it('should update image when opening with different image', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/image1.jpg')
    expect(vm.currentImage).toBe('/image1.jpg')

    vm.openModal('/image2.jpg')
    expect(vm.currentImage).toBe('/image2.jpg')
    expect(vm.isModalOpen).toBe(true)

    wrapper.unmount()
  })

  it('should handle consecutive close calls', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/image.jpg')
    vm.closeModal()
    expect(vm.isModalOpen).toBe(false)

    vm.closeModal()
    expect(vm.isModalOpen).toBe(false)

    wrapper.unmount()
  })

  it('should maintain proper state after multiple operations', () => {
    const TestComponent = defineComponent({
      setup() {
        return usePhotoModal()
      },
      template: '<div></div>'
    })

    const wrapper = mount(TestComponent)
    const vm = wrapper.vm as any

    vm.openModal('/image1.jpg')
    vm.closeModal()
    vm.openModal('/image2.jpg')
    expect(vm.isModalOpen).toBe(true)
    expect(vm.currentImage).toBe('/image2.jpg')
    expect(document.body.style.overflow).toBe('hidden')

    wrapper.unmount()
  })
})
