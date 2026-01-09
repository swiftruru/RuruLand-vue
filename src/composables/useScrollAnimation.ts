/**
 * 滾動動畫 Composable
 * 處理元素進入視窗時的多種動畫效果
 */
import { onMounted, onUnmounted } from 'vue'

export type AnimationType = 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'fade-in' | 'slide-up' | 'slide-left' | 'slide-right'

export function useScrollAnimation() {
  let observer: IntersectionObserver | null = null

  /**
   * 初始化滾動觀察器
   */
  function initScrollObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate')
          // 動畫完成後停止觀察（效能優化）
          observer?.unobserve(entry.target)
        }
      })
    }, observerOptions)

    // 觀察所有帶有 data-animate 屬性的元素
    const animateSelectors = [
      '[data-animate]',
      '.fade-in',
      '.fade-up',
      '.fade-down',
      '.fade-left',
      '.fade-right',
      '.zoom-in',
      '.slide-up',
      '.slide-left',
      '.slide-right'
    ]

    animateSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        observer?.observe(el)
      })
    })
  }

  /**
   * 平滑滾動到指定錨點
   */
  function smoothScrollTo(targetId: string) {
    const target = document.querySelector(targetId)
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  onMounted(() => {
    initScrollObserver()

    // 為所有錨點連結加入平滑滾動
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault()
        const href = (anchor as HTMLAnchorElement).getAttribute('href')
        if (href) {
          smoothScrollTo(href)
        }
      })
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return {
    smoothScrollTo
  }
}
