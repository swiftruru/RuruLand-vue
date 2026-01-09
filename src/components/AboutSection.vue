<template>
  <section id="about" class="about">
    <div class="container">
      <h2 class="section-title fade-up">{{ t('about.title') }}</h2>

      <div class="about-content">
        <div class="about-intro fade-up delay-100">
          <p class="intro-text">{{ t('about.intro') }}</p>
        </div>

        <div class="skills-section">
          <!-- 後端技術 -->
          <div class="skill-category fade-left delay-200">
            <h3>{{ t('about.skills.backend') }}</h3>
            <div class="tech-stack">
              <span class="tech-tag">.NET Framework</span>
              <span class="tech-tag">ASP.NET MVC</span>
              <span class="tech-tag">.NET Core</span>
              <span class="tech-tag">C#</span>
              <span class="tech-tag">Python</span>
              <span class="tech-tag">Django</span>
            </div>
          </div>

          <!-- 前端技術 -->
          <div class="skill-category fade-right delay-300">
            <h3>{{ t('about.skills.frontend') }}</h3>
            <div class="tech-stack">
              <span class="tech-tag">Vue.js</span>
              <span class="tech-tag">JavaScript</span>
              <span class="tech-tag">HTML5</span>
              <span class="tech-tag">CSS3</span>
              <span class="tech-tag">Sass</span>
            </div>
          </div>

          <!-- 開發工具 -->
          <div class="skill-category fade-left delay-400">
            <h3>{{ t('about.skills.tools') }}</h3>
            <div class="tech-stack">
              <span class="tech-tag">Git</span>
              <span class="tech-tag">Azure DevOps</span>
              <span class="tech-tag">GCP</span>
              <span class="tech-tag">Docker</span>
              <span class="tech-tag">PostgreSQL</span>
              <span class="tech-tag">SQL Server</span>
            </div>
          </div>

          <!-- 專業認證與經驗 -->
          <div class="skill-category fade-right delay-500">
            <h3>{{ t('about.skills.experience') }}</h3>
            <ul class="experience-list">
              <li>{{ t('about.experienceList.exp1') }}</li>
              <li>{{ t('about.experienceList.exp2') }}</li>
              <li>{{ t('about.experienceList.exp3') }}</li>
              <li>{{ t('about.experienceList.exp4') }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'

const { t } = useLanguage()
</script>
