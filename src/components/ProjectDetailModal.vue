<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="project-detail-modal" @click="handleBackdropClick">
      <div class="modal-content" @click.stop>
        <!-- 關閉按鈕 -->
        <button class="modal-close" @click="close" aria-label="Close modal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Modal 內容 -->
        <div v-if="project" class="detail-container">
          <!-- 專案標題與連結 -->
          <div class="detail-header">
            <h2 class="detail-title">{{ project.title }}</h2>
            <a
              v-if="project.url"
              :href="project.url"
              target="_blank"
              rel="noopener noreferrer"
              class="detail-link"
              @click="trackProjectView"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h14c1.11 0 2-.89 2-2v-7h-2v7z"/>
              </svg>
              {{ t('projects.viewWebsite') }}
            </a>
          </div>

          <!-- 專案圖片 -->
          <div class="detail-image-wrapper">
            <img
              :src="project.image"
              :alt="project.title"
              class="detail-image"
              @click="$emit('openPhotoModal', project.image)"
            >
            <p class="image-hint">{{ t('projects.clickToEnlarge') }}</p>
          </div>

          <!-- 專案描述 -->
          <div class="detail-section">
            <h3 class="section-heading">{{ t('projects.about') }}</h3>
            <p class="detail-description">{{ project.description }}</p>
          </div>

          <!-- 核心功能/負責項目 -->
          <div v-if="project.items && project.items.length" class="detail-section">
            <h3 class="section-heading">{{ project.sectionTitle }}</h3>
            <ul class="detail-list">
              <li v-for="(item, index) in project.items" :key="index" class="detail-list-item">
                {{ item }}
              </li>
            </ul>
          </div>

          <!-- 技術亮點 -->
          <div v-if="project.highlights && project.highlights.length" class="detail-section">
            <h3 class="section-heading">{{ t('projects.highlights') }}</h3>
            <div class="highlights-grid">
              <div
                v-for="(highlight, index) in project.highlights"
                :key="index"
                class="highlight-card"
              >
                <div class="highlight-icon">💡</div>
                <p class="highlight-text">{{ highlight }}</p>
              </div>
            </div>
          </div>

          <!-- 技術挑戰與解決方案 -->
          <div v-if="project.challenges && project.challenges.length" class="detail-section">
            <h3 class="section-heading">{{ t('projects.challengesAndSolutions') }}</h3>
            <div class="challenges-container">
              <div
                v-for="(challenge, index) in project.challenges"
                :key="index"
                class="challenge-item"
              >
                <div class="challenge-header">
                  <span class="challenge-badge">{{ t('projects.challenge') }} {{ index + 1 }}</span>
                  <h4 class="challenge-title">{{ challenge.title }}</h4>
                </div>
                <p class="challenge-problem">
                  <strong>{{ t('projects.problem') }}:</strong> {{ challenge.problem }}
                </p>
                <p class="challenge-solution">
                  <strong>{{ t('projects.solution') }}:</strong> {{ challenge.solution }}
                </p>
              </div>
            </div>
          </div>

          <!-- 技術棧 -->
          <div class="detail-section">
            <h3 class="section-heading">{{ t('projects.techStack') }}</h3>
            <div class="tech-stack-grid">
              <span
                v-for="(tech, index) in project.techStack"
                :key="index"
                class="tech-badge"
              >
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { trackEvent } from '../composables/useGoogleAnalytics'

interface ProjectDetail {
  title: string
  url?: string
  image: string
  description: string
  sectionTitle?: string
  items?: string[]
  highlights?: string[]
  challenges?: Array<{
    title: string
    problem: string
    solution: string
  }>
  techStack: string[]
}

const props = defineProps<{
  isOpen: boolean
  project: ProjectDetail | null
}>()

const emit = defineEmits<{
  close: []
  openPhotoModal: [imageSrc: string]
}>()

const { t } = useLanguage()

// 關閉 Modal
function close() {
  emit('close')
}

// 點擊背景關閉
function handleBackdropClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    close()
  }
}

// 追蹤專案查看
function trackProjectView() {
  if (props.project) {
    trackEvent('project_view', {
      project_name: props.project.title,
      project_url: props.project.url,
    })
  }
}

// ESC 鍵關閉
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleEscKey)
    document.body.style.overflow = 'hidden'

    // 追蹤 Modal 開啟
    if (props.project) {
      trackEvent('project_detail_view', {
        project_name: props.project.title,
      })
    }
  } else {
    document.removeEventListener('keydown', handleEscKey)
    document.body.style.overflow = ''
  }
})

function handleEscKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}
</script>

<style scoped>
/* Modal 淡入淡出動畫 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content,
.modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from .modal-content,
.modal-fade-leave-to .modal-content {
  transform: scale(0.95) rotate(0deg);
}

/* Modal 容器 */
.project-detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  overflow-y: auto;
}

/* 紙質風格的 Modal 主體 */
.modal-content {
  background: #fdfcf8;
  background-image:
    linear-gradient(90deg, rgba(200, 0, 0, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(200, 0, 0, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(139, 117, 83, 0.2);
  transform: rotate(0.5deg);
  transition: transform 0.3s ease;
}

/* 關閉按鈕 - 紙質圖釘風格 */
.modal-close {
  position: sticky;
  top: 1rem;
  right: 1rem;
  float: right;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(145deg, #ff6b6b, #ee5a52);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  margin: 1rem 1rem 0 0;
  box-shadow:
    0 2px 4px rgba(238, 90, 82, 0.3),
    0 4px 8px rgba(238, 90, 82, 0.2),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    inset 0 2px 2px rgba(255, 255, 255, 0.3);
}

.modal-close::before {
  content: '';
  position: absolute;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(0, 0, 0, 0.3), transparent);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: -1;
}

.modal-close:hover {
  transform: scale(1.1) rotate(15deg);
  box-shadow:
    0 3px 6px rgba(238, 90, 82, 0.4),
    0 6px 12px rgba(238, 90, 82, 0.3),
    inset 0 -2px 4px rgba(0, 0, 0, 0.2),
    inset 0 2px 2px rgba(255, 255, 255, 0.3);
}

.modal-close svg {
  width: 22px;
  height: 22px;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
}

/* 內容容器 */
.detail-container {
  padding: 3rem 2.5rem 2.5rem;
  clear: both;
}

/* 標題區域 */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px dashed rgba(139, 117, 83, 0.3);
}

.detail-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0;
  flex: 1;
  font-family: 'Noto Serif TC', serif;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8);
}

/* 查看網站按鈕 - 便條紙風格 */
.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #fff9c4;
  background-image: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  color: #6d4c41;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 117, 83, 0.2);
  box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transform: rotate(-1deg);
  position: relative;
}

.detail-link::before {
  content: '';
  position: absolute;
  top: -3px;
  right: 10px;
  width: 20px;
  height: 15px;
  background: rgba(255, 193, 7, 0.3);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(45deg);
}

.detail-link:hover {
  background: #fff59d;
  transform: rotate(0deg) translateY(-2px);
  box-shadow:
    3px 3px 8px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.detail-link svg {
  width: 18px;
  height: 18px;
}

/* 圖片區域 - 照片紙風格 */
.detail-image-wrapper {
  margin-bottom: 2.5rem;
  background: white;
  padding: 12px;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 4px 8px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(0, 0, 0, 0.05);
  transform: rotate(-0.5deg);
  transition: all 0.3s ease;
}

.detail-image-wrapper:hover {
  transform: rotate(0deg) translateY(-4px);
  box-shadow:
    0 4px 8px rgba(0, 0, 0, 0.12),
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}

.detail-image {
  width: 100%;
  height: auto;
  display: block;
  cursor: zoom-in;
  transition: transform 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.detail-image:hover {
  transform: scale(1.01);
}

.image-hint {
  text-align: center;
  padding: 0.75rem;
  font-size: 0.85rem;
  color: #8b7553;
  background: #faf8f3;
  margin: 0;
  margin-top: 8px;
  font-style: italic;
  border-top: 1px dashed rgba(139, 117, 83, 0.2);
}

/* 區塊 */
.detail-section {
  margin-bottom: 2.5rem;
}

/* 區塊標題 - 手寫標籤風格 */
.section-heading {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-left: 4px solid var(--accent-color);
  box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transform: translateX(-0.5rem);
  position: relative;
  font-family: 'Noto Serif TC', serif;
}

.section-heading::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 0 8px 8px;
  border-color: transparent transparent transparent #a5d6a7;
}

.detail-description {
  font-size: 1.05rem;
  line-height: 1.9;
  color: #4a4a4a;
  background: rgba(255, 255, 255, 0.6);
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px dashed rgba(139, 117, 83, 0.2);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* 列表 - 便條紙條目風格 */
.detail-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-list-item {
  padding: 0.9rem 1.2rem;
  padding-left: 2.5rem;
  position: relative;
  line-height: 1.7;
  color: #4a4a4a;
  background: linear-gradient(135deg, #fff9e6 0%, #fff3cd 100%);
  border-left: 3px solid #ffc107;
  box-shadow:
    1px 1px 3px rgba(0, 0, 0, 0.08),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transform: rotate(-0.3deg);
  transition: all 0.2s ease;
}

.detail-list-item:nth-child(even) {
  transform: rotate(0.3deg);
}

.detail-list-item:hover {
  transform: rotate(0deg) translateX(4px);
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.12),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.detail-list-item::before {
  content: '✓';
  position: absolute;
  left: 0.8rem;
  top: 0.9rem;
  color: #f57c00;
  font-weight: bold;
  font-size: 1.1rem;
  text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8);
}

/* 技術亮點 - 便條紙卡片 */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.highlight-card {
  background: linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%);
  border-top: 3px solid #0288d1;
  padding: 1.5rem;
  box-shadow:
    2px 3px 6px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  position: relative;
  transform: rotate(1deg);
}

.highlight-card:nth-child(2n) {
  transform: rotate(-1deg);
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
  border-top-color: #8e24aa;
}

.highlight-card:nth-child(3n) {
  transform: rotate(0.5deg);
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
  border-top-color: #f57c00;
}

.highlight-card:hover {
  transform: rotate(0deg) translateY(-6px) scale(1.02);
  box-shadow:
    3px 5px 12px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.highlight-card::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 20px;
  width: 24px;
  height: 20px;
  background: rgba(255, 193, 7, 0.4);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  transform: rotate(45deg);
}

.highlight-icon {
  font-size: 2.2rem;
  margin-bottom: 0.75rem;
  display: block;
  filter: drop-shadow(1px 1px 2px rgba(0, 0, 0, 0.1));
}

.highlight-text {
  color: #4a4a4a;
  line-height: 1.7;
  margin: 0;
  font-size: 0.95rem;
}

/* 技術挑戰 - 記事本風格 */
.challenges-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.challenge-item {
  background: #fffef7;
  background-image:
    repeating-linear-gradient(
      transparent,
      transparent 31px,
      rgba(139, 117, 83, 0.1) 31px,
      rgba(139, 117, 83, 0.1) 32px
    );
  padding: 1.5rem 1.5rem 1.5rem 3rem;
  border-left: 3px solid #d32f2f;
  box-shadow:
    2px 2px 6px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  position: relative;
}

.challenge-item::before {
  content: '';
  position: absolute;
  left: 2rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: rgba(211, 47, 47, 0.2);
}

.challenge-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
}

.challenge-badge {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  color: white;
  padding: 0.4rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow:
    1px 2px 4px rgba(211, 47, 47, 0.3),
    inset 0 -1px 2px rgba(0, 0, 0, 0.2);
  transform: rotate(-1deg);
}

.challenge-title {
  color: var(--primary-color);
  margin: 0;
  font-size: 1.2rem;
  font-family: 'Noto Serif TC', serif;
}

.challenge-problem,
.challenge-solution {
  margin: 1rem 0;
  padding: 1rem;
  line-height: 1.8;
  color: #4a4a4a;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  border-left: 3px solid #ffc107;
}

.challenge-solution {
  border-left-color: #66bb6a;
}

.challenge-problem strong,
.challenge-solution strong {
  color: var(--primary-color);
  font-family: 'Noto Serif TC', serif;
  font-size: 1.05em;
}

/* 技術棧 - 標籤貼紙風格 */
.tech-stack-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.9rem;
}

.tech-badge {
  background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
  color: var(--primary-color);
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  border: 2px solid var(--primary-color);
  box-shadow:
    2px 2px 4px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  position: relative;
  transform: rotate(-1deg);
}

.tech-badge:nth-child(2n) {
  transform: rotate(1deg);
}

.tech-badge:nth-child(3n) {
  transform: rotate(-0.5deg);
}

.tech-badge::before {
  content: '';
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 12px;
  background: rgba(255, 193, 7, 0.3);
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
}

.tech-badge:hover {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  color: white;
  transform: rotate(0deg) translateY(-3px) scale(1.05);
  box-shadow:
    3px 3px 8px rgba(26, 95, 63, 0.3),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

/* 響應式 */
@media (max-width: 768px) {
  .project-detail-modal {
    padding: 0;
  }

  .modal-content {
    border-radius: 0;
    max-height: 100vh;
    height: 100vh;
    transform: rotate(0deg);
  }

  .detail-container {
    padding: 2rem 1.5rem;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .detail-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .detail-link {
    width: 100%;
    justify-content: center;
    transform: rotate(0deg);
  }

  .highlights-grid {
    grid-template-columns: 1fr;
  }

  .highlight-card {
    transform: rotate(0deg);
  }

  .highlight-card:nth-child(2n),
  .highlight-card:nth-child(3n) {
    transform: rotate(0deg);
  }

  .section-heading {
    font-size: 1.3rem;
    transform: translateX(0);
  }

  .detail-list-item {
    transform: rotate(0deg);
  }

  .detail-list-item:nth-child(even) {
    transform: rotate(0deg);
  }

  .tech-badge {
    transform: rotate(0deg);
  }

  .tech-badge:nth-child(2n),
  .tech-badge:nth-child(3n) {
    transform: rotate(0deg);
  }

  .challenge-item::before {
    display: none;
  }

  .challenge-item {
    padding-left: 1.5rem;
  }
}
</style>
