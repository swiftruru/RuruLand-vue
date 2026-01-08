<template>
  <Transition name="loader-fade">
    <div v-if="isLoading" class="page-loader">
      <div class="loader-content">
        <!-- 吉祥物圖片 -->
        <div class="mascot-container">
          <img
            :src="mascotImage"
            alt="Yubiko mascot"
            class="mascot-image"
          />
          <div class="mascot-shadow"></div>
        </div>

        <!-- 載入文字 -->
        <h1 class="loader-title">{{ t('common.hero.name') }}</h1>
        <p class="loader-subtitle">{{ t('common.hero.title') }}</p>

        <!-- 載入進度條 -->
        <div class="loader-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <p class="progress-text">{{ Math.round(progress) }}%</p>
        </div>

        <!-- 載入動畫點點 -->
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const baseUrl = import.meta.env.BASE_URL
const mascotImage = `${baseUrl}images/loader/yubiko-mascot.png`

const isLoading = ref(true)
const progress = ref(0)

onMounted(() => {
  // 模擬載入進度
  const interval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += Math.random() * 15
    }
  }, 200)

  // 當頁面完全載入後
  window.addEventListener('load', () => {
    clearInterval(interval)
    progress.value = 100

    // 延遲一點時間讓使用者看到 100%
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  })

  // 備用方案：3秒後強制移除
  setTimeout(() => {
    clearInterval(interval)
    progress.value = 100
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }, 3000)
})
</script>

<style scoped>
.page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a5f3f 0%, #2d7a52 50%, #3a9664 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  overflow: hidden;
}

/* 背景動畫點點 */
.page-loader::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.06) 0%, transparent 50%);
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.loader-content {
  text-align: center;
  position: relative;
  z-index: 1;
  animation: slideUp 0.8s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 吉祥物容器 */
.mascot-container {
  position: relative;
  margin: 0 auto 2rem;
  width: 128px;
  height: 160px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.mascot-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3));
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.3))
            drop-shadow(0 0 10px rgba(255, 255, 255, 0.3));
  }
  to {
    filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4))
            drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
  }
}

.mascot-shadow {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 15px;
  background: radial-gradient(ellipse, rgba(0, 0, 0, 0.3), transparent);
  animation: shadowPulse 2s ease-in-out infinite;
}

@keyframes shadowPulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    opacity: 0.3;
  }
  50% {
    transform: translateX(-50%) scale(0.8);
    opacity: 0.5;
  }
}

/* 標題 */
.loader-title {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.loader-subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

/* 進度條 */
.loader-progress {
  width: 300px;
  margin: 0 auto 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffffff, #e8f5e9);
  border-radius: 10px;
  transition: width 0.3s ease;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  position: relative;
  overflow: hidden;
}

.progress-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.progress-text {
  color: white;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* 載入點點 */
.loading-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
}

.loading-dots span {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  animation: dotPulse 1.5s ease-in-out infinite;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.loading-dots span:nth-child(1) {
  animation-delay: 0s;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dotPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
}

/* 淡出動畫 */
.loader-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.loader-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 響應式 */
@media (max-width: 768px) {
  .loader-title {
    font-size: 2rem;
  }

  .loader-subtitle {
    font-size: 1rem;
  }

  .loader-progress {
    width: 250px;
  }

  .mascot-container {
    width: 100px;
    height: 125px;
  }
}
</style>
