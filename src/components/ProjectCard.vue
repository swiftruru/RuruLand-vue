<template>
  <div class="project-card">
    <!-- 專案圖片 -->
    <div class="project-image">
      <img
        :src="project.image"
        :alt="project.title"
        @click="$emit('openPhotoModal', project.image)"
      />
      <div class="project-overlay">
        <a :href="project.url" target="_blank" rel="noopener noreferrer" class="overlay-link">
          {{ t('projects.viewWebsite') }}
        </a>
      </div>
    </div>

    <!-- 專案標題與網址 -->
    <div class="project-header">
      <h3>{{ project.title }}</h3>
      <a :href="project.url" target="_blank" rel="noopener noreferrer" class="project-url">
        🔗 {{ project.url }}
      </a>
    </div>

    <!-- 專案內容 -->
    <div class="project-content">
      <!-- 專案描述 -->
      <p class="project-description">{{ project.description }}</p>

      <!-- 職責/特色列表 -->
      <div class="project-section">
        <h4>{{ project.sectionTitle }}</h4>
        <ul>
          <li v-for="(item, index) in project.items" :key="index">{{ item }}</li>
        </ul>
      </div>

      <!-- 技術棧 -->
      <div class="project-section">
        <h4>{{ t('projects.techStack') }}</h4>
        <div class="tech-stack">
          <span v-for="(tech, index) in project.techStack" :key="index" class="tech-tag">
            {{ tech }}
          </span>
        </div>
      </div>

      <!-- 亮點（僅 Django 專案顯示） -->
      <div v-if="project.highlights" class="highlight-section">
        <h4>{{ t('projects.highlights') }}</h4>
        <ul>
          <li v-for="(highlight, index) in project.highlights" :key="index">{{ highlight }}</li>
        </ul>
      </div>

      <!-- 專案連結 -->
      <div class="project-actions">
        <button class="project-detail-btn" @click="$emit('openDetailModal', project)">
          {{ t('projects.viewDetails') }}
        </button>
        <a :href="getFullUrl(project.url)" target="_blank" rel="noopener noreferrer" class="project-link">
          {{ t('projects.viewWebsite') }} →
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()

interface Project {
  title: string
  url: string
  image: string
  description: string
  sectionTitle: string
  items: string[]
  techStack: string[]
  highlights?: string[]
}

defineProps<{
  project: Project
}>()

defineEmits<{
  openPhotoModal: [imageSrc: string]
  openDetailModal: [project: Project]
}>()

// 確保 URL 包含協議
function getFullUrl(url: string): string {
  if (!url) return ''
  // 如果已經包含協議，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  // 否則添加 https://
  return `https://${url}`
}
</script>
