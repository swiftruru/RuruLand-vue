/**
 * 選單控制 Composable
 * 處理漢堡選單的開關邏輯
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useMenu() {
  const isMenuOpen = ref(false)

  /**
   * 切換選單開關
   */
  function toggleMenu() {
    isMenuOpen.value = !isMenuOpen.value
  }

  /**
   * 關閉選單
   */
  function closeMenu() {
    isMenuOpen.value = false
  }

  /**
   * 點擊選單外部時關閉選單
   */
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement
    const hamburger = document.querySelector('.hamburger')
    const navLinks = document.querySelector('.nav-links')

    if (hamburger && navLinks &&
        !hamburger.contains(target) &&
        !navLinks.contains(target)) {
      closeMenu()
    }
  }

  // 掛載時加入事件監聽
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  // 卸載時移除事件監聽
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu
  }
}
