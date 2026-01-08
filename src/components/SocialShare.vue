<template>
  <div class="social-share">
    <h3 class="share-title">{{ t('common.share.title') }}</h3>
    <div class="share-buttons">
      <!-- Facebook -->
      <a
        :href="facebookShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="share-button facebook"
        aria-label="Share on Facebook"
        @click="handleShareClick('Facebook')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        <span>Facebook</span>
      </a>

      <!-- Twitter / X -->
      <a
        :href="twitterShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="share-button twitter"
        aria-label="Share on Twitter"
        @click="handleShareClick('Twitter')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>Twitter</span>
      </a>

      <!-- LinkedIn -->
      <a
        :href="linkedInShareUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="share-button linkedin"
        aria-label="Share on LinkedIn"
        @click="handleShareClick('LinkedIn')"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        <span>LinkedIn</span>
      </a>

      <!-- 複製連結 -->
      <button
        class="share-button copy"
        :class="{ copied: isCopied }"
        @click="copyLink"
        aria-label="Copy link"
      >
        <svg v-if="!isCopied" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
        <span>{{ isCopied ? t('common.share.copied') : t('common.share.copy') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguage } from '../composables/useLanguage'
import { trackShare } from '../composables/useGoogleAnalytics'

const { t } = useLanguage()

const isCopied = ref(false)

// 網站資訊
const siteTitle = '潘昱如 - Full Stack Developer'

// 取得當前頁面 URL
const getCurrentUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.href
  }
  return 'https://ruruland.swift.moe'
}

// 分享 URLs
const facebookShareUrl = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getCurrentUrl())}`
)

const twitterShareUrl = computed(() =>
  `https://twitter.com/intent/tweet?url=${encodeURIComponent(getCurrentUrl())}&text=${encodeURIComponent(siteTitle)}&hashtags=WebDevelopment,FullStack`
)

const linkedInShareUrl = computed(() =>
  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getCurrentUrl())}`
)

// 複製連結功能
async function copyLink() {
  try {
    const url = getCurrentUrl()
    await navigator.clipboard.writeText(url)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
    // 追蹤複製連結事件
    trackShare('Copy Link', url)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// 追蹤分享事件
function handleShareClick(platform: string) {
  trackShare(platform, getCurrentUrl())
}
</script>

<style scoped>
.social-share {
  margin-top: 2rem;
  padding: 2rem;
  background: rgba(232, 245, 233, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(26, 95, 63, 0.1);
}

.share-title {
  color: var(--primary-color);
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.share-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.share-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  background: white;
}

.share-button svg {
  width: 20px;
  height: 20px;
}

/* Facebook */
.share-button.facebook {
  color: #1877f2;
  border-color: #1877f2;
}

.share-button.facebook:hover {
  background: #1877f2;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3);
}

/* Twitter / X */
.share-button.twitter {
  color: #000000;
  border-color: #000000;
}

.share-button.twitter:hover {
  background: #000000;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* LinkedIn */
.share-button.linkedin {
  color: #0a66c2;
  border-color: #0a66c2;
}

.share-button.linkedin:hover {
  background: #0a66c2;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
}

/* 複製按鈕 */
.share-button.copy {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.share-button.copy:hover {
  background: var(--primary-color);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.share-button.copy.copied {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

/* 響應式 */
@media (max-width: 768px) {
  .share-buttons {
    flex-direction: column;
  }

  .share-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
