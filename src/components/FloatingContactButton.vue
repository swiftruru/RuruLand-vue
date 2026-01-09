<template>
  <div class="floating-contact">
    <!-- 主按鈕 -->
    <Transition name="bounce">
      <button
        v-if="!isExpanded"
        class="contact-main-btn"
        @click="toggleExpand"
        :aria-label="t('contact.floatingButton')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>
    </Transition>

    <!-- 展開的聯絡選項 -->
    <Transition name="expand">
      <div v-if="isExpanded" class="contact-options">
        <!-- 關閉按鈕 -->
        <button
          class="contact-close-btn"
          @click="toggleExpand"
          :aria-label="t('common.close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- 聯絡方式列表 -->
        <div class="contact-list">
          <a
            href="mailto:ruru@ruruland.com"
            class="contact-item"
            @click="trackContact('email')"
          >
            <div class="contact-icon email">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Email</span>
              <span class="contact-value">ruru@ruruland.com</span>
            </div>
          </a>

          <a
            href="https://github.com/swiftruru"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-item"
            @click="trackContact('github')"
          >
            <div class="contact-icon github">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">GitHub</span>
              <span class="contact-value">@swiftruru</span>
            </div>
          </a>

          <a
            href="tel:+886912345678"
            class="contact-item"
            @click="trackContact('phone')"
          >
            <div class="contact-icon phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">Phone</span>
              <span class="contact-value">+886 912-345-678</span>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/yourprofile"
            target="_blank"
            rel="noopener noreferrer"
            class="contact-item"
            @click="trackContact('linkedin')"
          >
            <div class="contact-icon linkedin">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </div>
            <div class="contact-text">
              <span class="contact-label">LinkedIn</span>
              <span class="contact-value">Connect</span>
            </div>
          </a>
        </div>
      </div>
    </Transition>

    <!-- 背景遮罩 -->
    <Transition name="fade">
      <div
        v-if="isExpanded"
        class="contact-backdrop"
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
  // 這裡可以加入 Google Analytics 追蹤
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'contact_click', {
      method: method
    })
  }
}

// ESC 鍵關閉
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
  right: 2rem;
  z-index: 1000;
}

/* 主按鈕 */
.contact-main-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.contact-main-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.5);
}

.contact-main-btn:active {
  transform: scale(0.95);
}

/* 展開的聯絡選項 */
.contact-options {
  position: absolute;
  bottom: 0;
  right: 0;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  min-width: 320px;
  max-width: 360px;
}

.contact-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.contact-close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 2.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 12px;
  background: #f9fafb;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  cursor: pointer;
}

.contact-item:hover {
  background: #f3f4f6;
  transform: translateX(-4px);
}

.contact-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.contact-icon.email {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.contact-icon.github {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.contact-icon.phone {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.contact-icon.linkedin {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.contact-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.contact-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.contact-value {
  font-size: 0.95rem;
  font-weight: 500;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 背景遮罩 */
.contact-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: -1;
}

/* 動畫 */
.bounce-enter-active {
  animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bounce-leave-active {
  animation: bounce-out 0.3s ease-in;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

.expand-enter-active {
  animation: expand-in 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.expand-leave-active {
  animation: expand-out 0.2s ease-in;
}

@keyframes expand-in {
  0% {
    transform: scale(0.8) translateY(20px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes expand-out {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  100% {
    transform: scale(0.8) translateY(20px);
    opacity: 0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .floating-contact {
    bottom: 1.5rem;
    right: 1.5rem;
  }

  .contact-main-btn {
    width: 56px;
    height: 56px;
  }

  .contact-options {
    min-width: 280px;
    max-width: calc(100vw - 3rem);
    right: 0;
    bottom: 0;
  }

  .contact-item {
    padding: 0.875rem;
  }

  .contact-icon {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .floating-contact {
    bottom: 1rem;
    right: 1rem;
  }

  .contact-main-btn {
    width: 52px;
    height: 52px;
  }

  .contact-options {
    min-width: auto;
    width: calc(100vw - 2rem);
    padding: 1.25rem;
  }

  .contact-value {
    font-size: 0.875rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .contact-options {
    background: #1f2937;
  }

  .contact-close-btn {
    background: #374151;
    color: #9ca3af;
  }

  .contact-close-btn:hover {
    background: #4b5563;
    color: #e5e7eb;
  }

  .contact-item {
    background: #374151;
  }

  .contact-item:hover {
    background: #4b5563;
  }

  .contact-label {
    color: #9ca3af;
  }

  .contact-value {
    color: #f9fafb;
  }
}
</style>
