<template>
  <div id="app">
    <!-- 頁面載入動畫 -->
    <PageLoader />

    <!-- 導航列 -->
    <NavigationBar />

    <!-- 主要內容 -->
    <main>
      <!-- Hero 區塊 -->
      <HeroSection @open-photo-modal="openPhotoModal" />

      <!-- 關於我區塊 -->
      <AboutSection />

      <!-- 專案展示區塊 -->
      <ProjectsSection @open-photo-modal="openPhotoModal" />

      <!-- 聯絡區塊 -->
      <ContactSection />
    </main>

    <!-- 照片放大 Modal -->
    <PhotoModal
      :is-open="isModalOpen"
      :image-src="currentImage"
      @close="closeModal"
    />

    <!-- Footer -->
    <footer>
      <div class="container">
        <p>{{ t('common.footer.copyright') }}</p>
        <p>{{ t('common.footer.madeWith') }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import NavigationBar from './components/NavigationBar.vue'
import HeroSection from './components/HeroSection.vue'
import AboutSection from './components/AboutSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import ContactSection from './components/ContactSection.vue'
import PhotoModal from './components/PhotoModal.vue'
import PageLoader from './components/PageLoader.vue'
import { useLanguage } from './composables/useLanguage'
import { usePhotoModal } from './composables/usePhotoModal'
import { useScrollAnimation } from './composables/useScrollAnimation'
import { useCursorEffect } from './composables/useCursorEffect'

// 語言切換
const { t } = useLanguage()

// 照片 Modal
const { isModalOpen, currentImage, openModal, closeModal } = usePhotoModal()

function openPhotoModal(imageSrc: string) {
  openModal(imageSrc)
}

// 滾動動畫
useScrollAnimation()

// 自訂游標與粒子效果
useCursorEffect()
</script>
