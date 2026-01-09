import { describe, it, expect } from 'vitest'
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
})
