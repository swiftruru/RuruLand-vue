import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * 圖片懶加載 Composable
 * 使用 Intersection Observer API 實現高效能的圖片懶加載
 */
export function useLazyLoad() {
  const observer = ref<IntersectionObserver | null>(null)

  onMounted(() => {
    // 檢查瀏覽器是否支援 IntersectionObserver
    if ('IntersectionObserver' in window) {
      observer.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              const src = img.dataset.src

              if (src) {
                // 預載圖片
                const tempImage = new Image()
                tempImage.onload = () => {
                  img.src = src
                  img.classList.add('loaded')
                  img.removeAttribute('data-src')
                }
                tempImage.onerror = () => {
                  console.error(`Failed to load image: ${src}`)
                  img.classList.add('error')
                }
                tempImage.src = src

                // 停止觀察已載入的圖片
                observer.value?.unobserve(img)
              }
            }
          })
        },
        {
          // 提前 50px 開始載入
          rootMargin: '50px',
          threshold: 0.01,
        }
      )

      // 觀察所有帶有 data-src 的圖片
      const lazyImages = document.querySelectorAll('img[data-src]')
      lazyImages.forEach((img) => {
        observer.value?.observe(img)
      })
    } else {
      // Fallback: 直接載入所有圖片
      const lazyImages = document.querySelectorAll('img[data-src]')
      lazyImages.forEach((img) => {
        const element = img as HTMLImageElement
        const src = element.dataset.src
        if (src) {
          element.src = src
          element.removeAttribute('data-src')
        }
      })
    }
  })

  onUnmounted(() => {
    // 清理 observer
    observer.value?.disconnect()
  })

  /**
   * 手動觀察新增的圖片元素
   */
  function observeImage(imgElement: HTMLImageElement) {
    if (observer.value && imgElement.dataset.src) {
      observer.value.observe(imgElement)
    }
  }

  /**
   * 停止觀察圖片元素
   */
  function unobserveImage(imgElement: HTMLImageElement) {
    if (observer.value) {
      observer.value.unobserve(imgElement)
    }
  }

  return {
    observeImage,
    unobserveImage,
  }
}

/**
 * 單一圖片懶加載 Hook
 * 用於 Vue 組件中的單一圖片元素
 */
export function useLazyImage(imgRef: Ref<HTMLImageElement | null>) {
  const isLoaded = ref(false)
  const hasError = ref(false)

  onMounted(() => {
    if (!imgRef.value) return

    const img = imgRef.value
    const src = img.dataset.src

    if (!src) {
      isLoaded.value = true
      return
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(img, src)
              observer.unobserve(img)
            }
          })
        },
        {
          rootMargin: '50px',
          threshold: 0.01,
        }
      )

      observer.observe(img)

      onUnmounted(() => {
        observer.disconnect()
      })
    } else {
      // Fallback
      loadImage(img, src)
    }
  })

  function loadImage(img: HTMLImageElement, src: string) {
    const tempImage = new Image()

    tempImage.onload = () => {
      img.src = src
      img.classList.add('loaded')
      img.removeAttribute('data-src')
      isLoaded.value = true
    }

    tempImage.onerror = () => {
      console.error(`Failed to load image: ${src}`)
      img.classList.add('error')
      hasError.value = true
    }

    tempImage.src = src
  }

  return {
    isLoaded,
    hasError,
  }
}
