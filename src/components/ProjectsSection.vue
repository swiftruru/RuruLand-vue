<template>
  <section id="projects" class="projects">
    <div class="container">
      <h2 class="section-title">{{ t('projects.title') }}</h2>

      <div class="projects-grid fade-in">
        <!-- FLORIS 香水電商網站 -->
        <ProjectCard
          :project="perfumeProject"
          @open-photo-modal="$emit('openPhotoModal', $event)"
        />

        <!-- RuDjango 部落格網站 -->
        <ProjectCard
          :project="djangoProject"
          @open-photo-modal="$emit('openPhotoModal', $event)"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import ProjectCard from './ProjectCard.vue'

const { t } = useLanguage()

defineEmits<{
  openPhotoModal: [imageSrc: string]
}>()

// FLORIS 香水電商專案
const perfumeProject = computed(() => ({
  title: t('projects.perfume.title'),
  url: t('projects.perfume.url'),
  image: '/images/projects/01_FLORIS.jpeg',
  description: t('projects.perfume.description'),
  sectionTitle: t('projects.perfume.responsibilities.title'),
  items: [
    t('projects.perfume.responsibilities.item1'),
    t('projects.perfume.responsibilities.item2'),
    t('projects.perfume.responsibilities.item3'),
    t('projects.perfume.responsibilities.item4')
  ],
  techStack: [
    t('projects.perfume.techStack.tech1'),
    t('projects.perfume.techStack.tech2'),
    t('projects.perfume.techStack.tech3'),
    t('projects.perfume.techStack.tech4'),
    t('projects.perfume.techStack.tech5'),
    t('projects.perfume.techStack.tech6'),
    t('projects.perfume.techStack.tech7')
  ]
}))

// RuDjango 部落格專案
const djangoProject = computed(() => ({
  title: t('projects.django.title'),
  url: t('projects.django.url'),
  image: '/images/projects/02_RuDjango.png',
  description: t('projects.django.description'),
  sectionTitle: t('projects.django.features.title'),
  items: [
    t('projects.django.features.item1'),
    t('projects.django.features.item2'),
    t('projects.django.features.item3'),
    t('projects.django.features.item4')
  ],
  techStack: [
    t('projects.django.techStack.tech1'),
    t('projects.django.techStack.tech2'),
    t('projects.django.techStack.tech3'),
    t('projects.django.techStack.tech4'),
    t('projects.django.techStack.tech5')
  ],
  highlights: [
    t('projects.django.highlights.item1'),
    t('projects.django.highlights.item2'),
    t('projects.django.highlights.item3')
  ]
}))
</script>
