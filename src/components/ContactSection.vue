<template>
  <section id="contact" class="contact">
    <div class="container">
      <h2 class="section-title">{{ t('contact.title') }}</h2>

      <div class="contact-content fade-in">
        <div class="contact-intro">
          <p>{{ t('contact.intro') }}</p>
        </div>

        <div class="contact-grid">
          <!-- Email -->
          <div class="contact-item">
            <span class="contact-icon">📧</span>
            <h3>{{ t('contact.email.title') }}</h3>
            <a href="mailto:ruru@swift.moe" class="contact-link" @click="trackContact('email')">
              {{ t('contact.email.address') }}
            </a>
          </div>

          <!-- Website -->
          <div class="contact-item">
            <span class="contact-icon">🌐</span>
            <h3>Website</h3>
            <a
              href="https://swift.moe"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
            >
              swift.moe
            </a>
          </div>

          <!-- GitHub -->
          <div class="contact-item">
            <span class="contact-icon">💻</span>
            <h3>{{ t('contact.github.title') }}</h3>
            <a
              href="https://github.com/swiftruru"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
              @click="trackContact('github')"
            >
              {{ t('contact.github.username') }}
            </a>
          </div>

          <!-- Location -->
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <h3>{{ t('contact.location.title') }}</h3>
            <p class="contact-text">{{ t('contact.location.city') }}</p>
          </div>
        </div>

        <!-- Social Links -->
        <div class="social-links">
          <a
            href="mailto:ruru@swift.moe"
            class="social-link"
            aria-label="Email"
            title="Email"
            @click="trackContact('email')"
          >
            📧
          </a>
          <a
            href="https://swift.moe"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            aria-label="Website"
            title="Website"
            @click="trackContact('website')"
          >
            🌐
          </a>
          <a
            href="https://github.com/swiftruru"
            target="_blank"
            rel="noopener noreferrer"
            class="social-link"
            aria-label="GitHub"
            title="GitHub"
            @click="trackContact('github')"
          >
            💻
          </a>
        </div>

        <!-- 履歷列印區 -->
        <div class="resume-actions fade-in">
          <button
            class="btn btn-primary resume-btn print-resume-btn"
            @click="handlePrint"
            :aria-label="t('about.resume.print')"
          >
            <span class="btn-icon">🖨️</span>
            <span class="btn-text">{{ t('about.resume.print') }}</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLanguage } from '../composables/useLanguage'
import { trackContact, trackEvent } from '../composables/useGoogleAnalytics'

const { t } = useLanguage()

function handlePrint() {
  trackEvent('resume_print', {
    source: 'contact_section'
  })
  window.print()
}
</script>
