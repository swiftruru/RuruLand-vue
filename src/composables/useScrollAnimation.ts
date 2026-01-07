/**
 * 滾動動畫 Composable
 * 處理元素進入視窗時的淡入動畫
 */
import { onMounted, onUnmounted } from 'vue'

export function useScrollAnimation() {
  let observer: IntersectionObserver | null = null

  /**
   * 初始化滾動觀察器
   */
  function initScrollObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    }

    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    }, observerOptions)

    // 觀察所有 fade-in 元素
    document.querySelectorAll('.fade-in').forEach(el => {
      observer?.observe(el)
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
      anchor.addEventListener('click', function (e) {
        e.preventDefault()
        const href = (this as HTMLAnchorElement).getAttribute('href')
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
