import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 無障礙功能 Composable
 * 提供高對比度模式、鍵盤導航偵測、焦點管理等功能
 */
export function useAccessibility() {
  const isHighContrast = ref(false)
  const isKeyboardNavigation = ref(false)

  // 載入保存的偏好設定
  onMounted(() => {
    // 從 localStorage 讀取高對比度偏好
    const savedContrast = localStorage.getItem('highContrast')
    if (savedContrast === 'true') {
      enableHighContrast()
    }

    // 偵測使用者是否使用鍵盤導航
    detectKeyboardNavigation()

    // 偵測系統偏好的對比度
    detectSystemContrast()
  })

  /**
   * 切換高對比度模式
   */
  function toggleHighContrast() {
    isHighContrast.value = !isHighContrast.value

    if (isHighContrast.value) {
      enableHighContrast()
    } else {
      disableHighContrast()
    }

    // 保存偏好設定
    localStorage.setItem('highContrast', String(isHighContrast.value))
  }

  /**
   * 啟用高對比度模式
   */
  function enableHighContrast() {
    document.body.classList.add('high-contrast')
    isHighContrast.value = true
  }

  /**
   * 停用高對比度模式
   */
  function disableHighContrast() {
    document.body.classList.remove('high-contrast')
    isHighContrast.value = false
  }

  /**
   * 偵測鍵盤導航
   */
  function detectKeyboardNavigation() {
    let isUsingKeyboard = false

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        isUsingKeyboard = true
        document.body.classList.add('keyboard-navigation')
        isKeyboardNavigation.value = true
      }
    }

    const handleMouseDown = () => {
      if (isUsingKeyboard) {
        isUsingKeyboard = false
        document.body.classList.remove('keyboard-navigation')
        isKeyboardNavigation.value = false
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    onUnmounted(() => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    })
  }

  /**
   * 偵測系統偏好的對比度設定
   */
  function detectSystemContrast() {
    if (window.matchMedia) {
      const contrastQuery = window.matchMedia('(prefers-contrast: high)')

      // 如果系統偏好高對比度，自動啟用
      if (contrastQuery.matches && !localStorage.getItem('highContrast')) {
        enableHighContrast()
      }

      // 監聽系統設定變更
      contrastQuery.addEventListener('change', (e) => {
        if (e.matches && !localStorage.getItem('highContrast')) {
          enableHighContrast()
        }
      })
    }
  }

  /**
   * 宣告頁面區域給螢幕閱讀器
   */
  function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div')
    announcement.setAttribute('role', 'status')
    announcement.setAttribute('aria-live', priority)
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)

    // 3 秒後移除
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 3000)
  }

  /**
   * 焦點陷阱（用於 Modal）
   */
  function trapFocus(element: HTMLElement) {
    const focusableElements = element.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // 如果沒有可聚焦元素，直接返回空的清理函數
    if (!firstElement || !lastElement) {
      return () => {}
    }

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus()
          e.preventDefault()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)

    // 將焦點移到第一個元素
    firstElement.focus()

    // 返回清理函數
    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }

  return {
    isHighContrast,
    isKeyboardNavigation,
    toggleHighContrast,
    enableHighContrast,
    disableHighContrast,
    announceToScreenReader,
    trapFocus,
  }
}
