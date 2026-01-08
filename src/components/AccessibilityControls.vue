<template>
  <transition name="fade-slide">
    <button
      v-show="showBackToTop"
      class="back-to-top"
      @click="scrollToTop"
      aria-label="回到頂部"
      title="回到頂部"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="back-to-top-text">TOP</span>
    </button>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const showBackToTop = ref(false)

function handleScroll() {
  // 當滾動超過 300px 時顯示按鈕
  showBackToTop.value = window.scrollY > 300
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1500;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  background: var(--card-bg);
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  box-shadow:
    0 4px 12px rgba(26, 95, 63, 0.15),
    0 2px 4px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* 紙張質感 */
  background-image:
    linear-gradient(90deg, transparent 79px, rgba(26, 95, 63, 0.02) 79px, rgba(26, 95, 63, 0.02) 81px, transparent 81px),
    linear-gradient(rgba(26, 95, 63, 0.01) 0.1em, transparent 0.1em);
  background-size: 100% 1.5em;
}

.back-to-top:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-4px);
  box-shadow:
    0 8px 24px rgba(26, 95, 63, 0.25),
    0 4px 8px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
}

.back-to-top:active {
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(26, 95, 63, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-to-top svg {
  width: 24px;
  height: 24px;
}

.back-to-top-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: -2px;
}

/* 過渡動畫 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .back-to-top {
    bottom: 1.5rem;
    right: 1.5rem;
    width: 52px;
    height: 52px;
  }

  .back-to-top svg {
    width: 20px;
    height: 20px;
  }

  .back-to-top-text {
    font-size: 0.6rem;
  }
}

/* 焦點樣式 */
.back-to-top:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 4px;
}
</style>
