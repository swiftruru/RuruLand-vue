<template>
  <div class="floating-contact">
    <!-- 主按鈕 -->
    <Transition name="fade-slide">
      <button
        v-if="!isExpanded"
        class="contact-main-btn"
        @click="toggleExpand"
        :aria-label="t('contact.floatingButton')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span class="btn-text">聯絡</span>
      </button>
    </Transition>

    <!-- 展開的聯絡選項 -->
    <Transition name="expand">
      <div v-if="isExpanded" class="contact-panel">
        <!-- 標題與關閉按鈕 -->
        <div class="panel-header">
          <h3>{{ t('contact.floatingButton') }}</h3>
          <button
            class="close-btn"
            @click="toggleExpand"
            :aria-label="t('common.close')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 聯絡方式列表 -->
        <div class="contact-list">
          <a
            href="mailto:ruru@swift.moe"
            class="contact-item"
            @click="trackContact('email')"
          >
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div class="contact-info">
              <span class="label">Email</span>
              <span class="value">ruru@swift.moe</span>
            </div>
          </a>

          <a
            href="https://github.com/swiftruru"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-item"
            @click="trackContact('github')"
          >
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
            <div class="contact-info">
              <span class="label">GitHub</span>
              <span class="value">@swiftruru</span>
            </div>
          </a>

          <a
            href="tel:+886977006588"
            class="contact-item"
            @click="trackContact('phone')"
          >
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="contact-info">
              <span class="label">Phone</span>
              <span class="value">0977-006-588</span>
            </div>
          </a>
        </div>
      </div>
    </Transition>

    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div
        v-if="isExpanded"
        class="backdrop"
        @click="toggleExpand"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

const trackContact = (method: string) => {
  console.log(`Contact via ${method}`)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'contact_click', {
      method: method
    })
  }
}

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isExpanded.value) {
    toggleExpand()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
.floating-contact {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 1000;
}

/* 主按鈕 - 配合 back to top 樣式 */
.contact-main-btn {
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

.contact-main-btn:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-4px);
  box-shadow:
    0 8px 24px rgba(26, 95, 63, 0.25),
    0 4px 8px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color);
}

.contact-main-btn:active {
  transform: translateY(-2px);
}

.contact-main-btn svg {
  width: 22px;
  height: 22px;
}

.btn-text {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  margin-top: -2px;
}

/* 展開面板 */
.contact-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  min-width: 300px;
  background: var(--card-bg);
  border: 2px solid var(--primary-color);
  border-radius: 12px;
  box-shadow:
    0 8px 24px rgba(26, 95, 63, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  /* 紙張質感 */
  background-image:
    linear-gradient(90deg, transparent 79px, rgba(26, 95, 63, 0.02) 79px, rgba(26, 95, 63, 0.02) 81px, transparent 81px),
    linear-gradient(rgba(26, 95, 63, 0.01) 0.1em, transparent 0.1em);
  background-size: 100% 1.5em;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: var(--primary-color);
  color: white;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.contact-list {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem;
  border-radius: 8px;
  background: var(--bg-color);
  border: 1px solid rgba(26, 95, 63, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.contact-item:hover {
  background: rgba(26, 95, 63, 0.05);
  border-color: rgba(26, 95, 63, 0.2);
  transform: translateX(4px);
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  flex: 1;
  min-width: 0;
}

.label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.value {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 背景遮罩 */
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
  z-index: -1;
}

/* 動畫 */
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

.expand-enter-active {
  animation: expand-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-leave-active {
  animation: expand-out 0.2s ease-in;
}

@keyframes expand-in {
  0% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes expand-out {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .floating-contact {
    bottom: 1.5rem;
    left: 1.5rem;
  }

  .contact-main-btn {
    width: 52px;
    height: 52px;
  }

  .contact-main-btn svg {
    width: 20px;
    height: 20px;
  }

  .btn-text {
    font-size: 0.6rem;
  }

  .contact-panel {
    min-width: 280px;
    max-width: calc(100vw - 3rem);
  }

  .contact-item {
    padding: 0.75rem;
  }

  .icon-wrapper {
    width: 32px;
    height: 32px;
  }

  .value {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .floating-contact {
    bottom: 1rem;
    left: 1rem;
  }

  .contact-main-btn {
    width: 48px;
    height: 48px;
  }

  .contact-panel {
    min-width: 260px;
  }
}

/* 焦點樣式 */
.contact-main-btn:focus-visible,
.close-btn:focus-visible {
  outline: 3px solid var(--primary-color);
  outline-offset: 4px;
}
</style>
