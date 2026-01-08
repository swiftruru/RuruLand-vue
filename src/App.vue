<template>
  <div id="app">
    <!-- 跳過連結 -->
    <a href="#main-content" class="skip-link">
      {{ t('common.accessibility.skipToMain') }}
    </a>

    <!-- 頁面載入動畫 -->
    <PageLoader />

    <!-- 導航列 -->
    <NavigationBar />

    <!-- 主要內容 -->
    <main id="main-content" role="main">
      <!-- Hero 區塊 -->
      <HeroSection @open-photo-modal="openPhotoModal" />

      <!-- 關於我區塊 -->
      <AboutSection />

      <!-- 職涯歷程區塊 -->
      <TimelineSection />

      <!-- 專案展示區塊 -->
      <ProjectsSection
        @open-photo-modal="openPhotoModal"
        @open-detail-modal="openProjectDetail"
      />

      <!-- 聯絡區塊 -->
      <ContactSection />
    </main>

    <!-- 照片放大 Modal -->
    <PhotoModal
      :is-open="isModalOpen"
      :image-src="currentImage"
      @close="closeModal"
    />

    <!-- 專案詳細 Modal -->
    <ProjectDetailModal
      :is-open="isProjectDetailOpen"
      :project="currentProject"
      @close="closeProjectDetail"
      @open-photo-modal="openPhotoModal"
    />

    <!-- Footer -->
    <footer role="contentinfo">
      <div class="container">
        <!-- 社群分享 -->
        <SocialShare />

        <p>{{ t('common.footer.copyright') }}</p>
        <p>{{ t('common.footer.madeWith') }}</p>
      </div>
    </footer>

    <!-- 無障礙控制 -->
    <AccessibilityControls />
  </div>
</template>

<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import TimelineSection from './components/TimelineSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import PhotoModal from './components/PhotoModal.vue'
import PageLoader from './components/PageLoader.vue'
import SocialShare from './components/SocialShare.vue'
import ProjectDetailModal from './components/ProjectDetailModal.vue'
import AccessibilityControls from './components/AccessibilityControls.vue'
import { ref } from 'vue'
import { useLanguage } from './composables/useLanguage'
import { usePhotoModal } from './composables/usePhotoModal'
import { useScrollAnimation } from './composables/useScrollAnimation'
import { useCursorEffect } from './composables/useCursorEffect'
import { useGoogleAnalytics } from './composables/useGoogleAnalytics'

// 語言切換
const { t } = useLanguage()

// 照片 Modal
const { isModalOpen, currentImage, openModal, closeModal } = usePhotoModal()

function openPhotoModal(imageSrc: string) {
  openModal(imageSrc)
}

// 專案詳細 Modal
const isProjectDetailOpen = ref(false)
const currentProject = ref<any>(null)

function openProjectDetail(project: any) {
  currentProject.value = project
  isProjectDetailOpen.value = true
}

function closeProjectDetail() {
  isProjectDetailOpen.value = false
  setTimeout(() => {
    currentProject.value = null
  }, 300)
}

// 滾動動畫
useScrollAnimation()

// 自訂游標與粒子效果
useCursorEffect()

// Google Analytics
useGoogleAnalytics()
</script>
