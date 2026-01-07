import { ref, onMounted, onUnmounted } from 'vue'

export function usePhotoModal() {
  const isModalOpen = ref(false)
  const currentImage = ref('')

  function openModal(imageSrc: string) {
    currentImage.value = imageSrc
    isModalOpen.value = true
    // 防止背景滾動
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    isModalOpen.value = false
    currentImage.value = ''
    // 恢復背景滾動
    document.body.style.overflow = ''
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isModalOpen.value) {
      closeModal()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
    // 清理：確保 body overflow 被重置
    document.body.style.overflow = ''
  })

  return {
    isModalOpen,
    currentImage,
    openModal,
    closeModal
  }
}
