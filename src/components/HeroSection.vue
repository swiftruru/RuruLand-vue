<template>
  <section id="home" class="hero">
    <div class="container">
      <div class="hero-profile zoom-in">
        <img
          :data-src="profileImage"
          :alt="t('common.hero.name') + '的照片'"
          class="profile-photo"
          @click="$emit('openPhotoModal', profileImage)"
        />
      </div>
      <h1 class="fade-up delay-100">{{ t('common.hero.name') }}</h1>
      <h2 class="hero-subtitle fade-up delay-200">{{ t('common.hero.nameEn') }}</h2>
      <p class="hero-title fade-up delay-300">{{ t('common.hero.title') }}</p>
      <p class="subtitle fade-up delay-400">{{ t('common.hero.subtitle') }}</p>
      <div class="hero-buttons fade-up delay-500">
        <a href="#about" class="btn btn-primary">{{ t('common.hero.aboutMe') }}</a>
        <a href="#projects" class="btn btn-outline">{{ t('common.hero.viewProjects') }}</a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
const baseUrl = import.meta.env.BASE_URL
const profileImage = `${baseUrl}images/profile.jpg`

defineEmits<{
  openPhotoModal: [imageSrc: string]
}>()
</script>
