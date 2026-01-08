<template>
  <section id="timeline" class="timeline">
    <div class="container">
      <h2 class="section-title">{{ t('timeline.title') }}</h2>

      <div class="timeline-content fade-in">
        <!-- 工作經驗 -->
        <div class="timeline-category">
          <h3 class="timeline-category-title">{{ t('timeline.workExperience.title') }}</h3>
          <div class="timeline-items">
            <!-- 軟體工程師 - 台灣萬事達金流 -->
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-card">
                <div class="timeline-header">
                  <h4 class="timeline-job-title">{{ t('timeline.workExperience.job1.title') }}</h4>
                  <span class="timeline-company">{{ t('timeline.workExperience.job1.company') }}</span>
                  <span class="timeline-period">{{ t('timeline.workExperience.job1.period') }}</span>
                </div>
                <ul class="timeline-description">
                  <li v-for="(desc, index) in job1Descriptions" :key="index">
                    {{ desc }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 數位學伴計畫帶班老師 - 教育部 -->
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-card">
                <div class="timeline-header">
                  <h4 class="timeline-job-title">{{ t('timeline.workExperience.job2.title') }}</h4>
                  <span class="timeline-company">{{ t('timeline.workExperience.job2.company') }}</span>
                  <span class="timeline-period">{{ t('timeline.workExperience.job2.period') }}</span>
                </div>
                <ul class="timeline-description">
                  <li v-for="(desc, index) in job2Descriptions" :key="index">
                    {{ desc }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- 資管系教學助理 - 中華大學 -->
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-card">
                <div class="timeline-header">
                  <h4 class="timeline-job-title">{{ t('timeline.workExperience.job3.title') }}</h4>
                  <span class="timeline-company">{{ t('timeline.workExperience.job3.company') }}</span>
                  <span class="timeline-period">{{ t('timeline.workExperience.job3.period') }}</span>
                </div>
                <ul class="timeline-description">
                  <li v-for="(desc, index) in job3Descriptions" :key="index">
                    {{ desc }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 教育背景 -->
        <div class="timeline-category">
          <h3 class="timeline-category-title">{{ t('timeline.education.title') }}</h3>
          <div class="timeline-items">
            <!-- 碩士班 -->
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-card">
                <div class="timeline-header">
                  <h4 class="timeline-job-title">{{ t('timeline.education.master.degree') }}</h4>
                  <span class="timeline-company">{{ t('timeline.education.master.school') }}</span>
                  <span class="timeline-period">
                    {{ t('timeline.education.master.period') }}
                    <span class="timeline-status-badge">{{ t('timeline.education.master.status') }}</span>
                  </span>
                </div>
                <ul class="timeline-description">
                  <li v-for="(desc, index) in masterDescriptions" :key="index">
                    {{ desc }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- Build School 培訓 -->
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-card">
                <div class="timeline-header">
                  <h4 class="timeline-job-title">{{ t('timeline.education.buildSchool.title') }}</h4>
                  <span class="timeline-period">{{ t('timeline.education.buildSchool.period') }}</span>
                </div>
                <ul class="timeline-description">
                  <li v-for="(desc, index) in buildSchoolDescriptions" :key="index">
                    {{ desc }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- 專業證照 -->
        <div class="timeline-category">
          <h3 class="timeline-category-title">{{ t('timeline.certifications.title') }}</h3>
          <div class="certifications-grid">
            <div
              v-for="(cert, index) in certifications"
              :key="index"
              class="certification-item"
            >
              <span class="certification-icon">🏆</span>
              <span class="certification-name">{{ cert }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()

// 使用 tm() 來獲取陣列，然後用 t() 來轉換每個項目
const job1Descriptions = computed(() => {
  const desc = tm('timeline.workExperience.job1.description')
  if (Array.isArray(desc)) {
    return desc.map((_, index) => t(`timeline.workExperience.job1.description.${index}`))
  }
  return []
})

const job2Descriptions = computed(() => {
  const desc = tm('timeline.workExperience.job2.description')
  if (Array.isArray(desc)) {
    return desc.map((_, index) => t(`timeline.workExperience.job2.description.${index}`))
  }
  return []
})

const job3Descriptions = computed(() => {
  const desc = tm('timeline.workExperience.job3.description')
  if (Array.isArray(desc)) {
    return desc.map((_, index) => t(`timeline.workExperience.job3.description.${index}`))
  }
  return []
})

const masterDescriptions = computed(() => {
  const desc = tm('timeline.education.master.description')
  if (Array.isArray(desc)) {
    return desc.map((_, index) => t(`timeline.education.master.description.${index}`))
  }
  return []
})

const buildSchoolDescriptions = computed(() => {
  const desc = tm('timeline.education.buildSchool.description')
  if (Array.isArray(desc)) {
    return desc.map((_, index) => t(`timeline.education.buildSchool.description.${index}`))
  }
  return []
})

const certifications = computed(() => {
  const list = tm('timeline.certifications.list')
  if (Array.isArray(list)) {
    return list.map((_, index) => t(`timeline.certifications.list.${index}`))
  }
  return []
})
</script>
