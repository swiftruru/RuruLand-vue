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
            <h3>{{ t('contact.email.title') }}</h3>
            <a href="mailto:ruru@swift.moe" class="contact-link" @click="trackContact('email')">
              {{ t('contact.email.address') }}
            </a>
          </div>

          <!-- Phone -->
          <div class="contact-item">
            <h3>{{ t('contact.phone.title') }}</h3>
            <a href="tel:+886977006588" class="contact-link" @click="trackContact('phone')">
              {{ t('contact.phone.number') }}
            </a>
          </div>

          <!-- GitHub -->
          <div class="contact-item">
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

          <!-- CakeResume -->
          <div class="contact-item">
            <h3>{{ t('contact.cakeresume.title') }}</h3>
            <a
              href="https://www.cake.me/s--n_h9IMsdC_tvtnXCUcLp7Q--/sandyru2025"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
              @click="trackContact('cakeresume')"
            >
              {{ t('contact.cakeresume.text') }}
            </a>
          </div>

          <!-- Website -->
          <div class="contact-item">
            <h3>{{ t('contact.website.title') }}</h3>
            <a
              href="https://swift.moe"
              target="_blank"
              rel="noopener noreferrer"
              class="contact-link"
              @click="trackContact('website')"
            >
              {{ t('contact.website.url') }}
            </a>
          </div>

          <!-- Location -->
          <div class="contact-item">
            <h3>{{ t('contact.location.title') }}</h3>
            <p class="contact-text">{{ t('contact.location.city') }}</p>
          </div>
        </div>

        <!-- 履歷列印區 -->
        <div class="resume-actions fade-in">
          <button
            class="btn btn-primary resume-btn print-resume-btn"
            @click="handlePrint"
            :aria-label="t('about.resume.print')"
          >
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
