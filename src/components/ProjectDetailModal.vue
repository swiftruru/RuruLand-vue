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
              :href="`https://${project.url}`"
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
  transform: scale(0.95);
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

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* 關閉按鈕 */
.modal-close {
  position: sticky;
  top: 1rem;
  right: 1rem;
  float: right;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;
  margin: 1rem 1rem 0 0;
}

.modal-close:hover {
  background: var(--primary-color);
  color: white;
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

/* 內容容器 */
.detail-container {
  padding: 2rem;
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
}

.detail-title {
  font-size: 2rem;
  color: var(--primary-color);
  margin: 0;
  flex: 1;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.detail-link:hover {
  background: var(--secondary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(26, 95, 63, 0.3);
}

.detail-link svg {
  width: 18px;
  height: 18px;
}

/* 圖片區域 */
.detail-image-wrapper {
  margin-bottom: 2rem;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.detail-image {
  width: 100%;
  height: auto;
  display: block;
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.detail-image:hover {
  transform: scale(1.02);
}

.image-hint {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.9rem;
  color: #666;
  background: #f9f9f9;
  margin: 0;
}

/* 區塊 */
.detail-section {
  margin-bottom: 2.5rem;
}

.section-heading {
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--accent-color);
}

.detail-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #333;
}

/* 列表 */
.detail-list {
  list-style: none;
  padding: 0;
}

.detail-list-item {
  padding: 0.75rem 0;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.6;
  color: #333;
}

.detail-list-item::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-color);
  font-weight: bold;
}

/* 技術亮點 */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.highlight-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8f4 100%);
  border-left: 4px solid var(--accent-color);
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.highlight-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(26, 95, 63, 0.1);
}

.highlight-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.highlight-text {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

/* 技術挑戰 */
.challenges-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.challenge-item {
  background: #f9f9f9;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
}

.challenge-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.challenge-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.challenge-title {
  color: var(--primary-color);
  margin: 0;
  font-size: 1.2rem;
}

.challenge-problem,
.challenge-solution {
  margin: 0.75rem 0;
  line-height: 1.6;
  color: #333;
}

.challenge-problem strong,
.challenge-solution strong {
  color: var(--primary-color);
}

/* 技術棧 */
.tech-stack-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-badge {
  background: white;
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: 600;
  border: 2px solid var(--primary-color);
  transition: all 0.3s ease;
}

.tech-badge:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
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
  }

  .detail-container {
    padding: 1.5rem;
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
  }

  .highlights-grid {
    grid-template-columns: 1fr;
  }

  .section-heading {
    font-size: 1.3rem;
  }
}
</style>
