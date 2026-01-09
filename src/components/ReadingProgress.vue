<template>
  <div class="reading-progress-bar" :style="{ width: scrollProgress + '%' }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const scrollProgress = ref(0)

function updateScrollProgress() {
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight
  const scrollTop = window.scrollY || document.documentElement.scrollTop

  // 計算可滾動的總高度
  const scrollableHeight = documentHeight - windowHeight

  if (scrollableHeight > 0) {
    // 計算滾動百分比
    const progress = (scrollTop / scrollableHeight) * 100
    scrollProgress.value = Math.min(100, Math.max(0, progress))
  }
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  updateScrollProgress() // 初始化
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>
