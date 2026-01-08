/**
 * Google Analytics 4 整合
 * 提供頁面追蹤和事件追蹤功能
 */

import { onMounted } from 'vue'

// GA4 Measurement ID from environment variable
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

// 擴展 Window 介面以支援 gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

/**
 * 初始化 Google Analytics
 */
export function useGoogleAnalytics() {
  onMounted(() => {
    // 只在生產環境且有設定 Measurement ID 時載入 GA
    if (!GA_MEASUREMENT_ID || import.meta.env.DEV) {
      console.log('[GA] Google Analytics disabled in development mode')
      return
    }

    // 載入 gtag.js script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)

    // 初始化 dataLayer
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }

    // 設定 GA
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, {
      send_page_view: true,
    })

    console.log('[GA] Google Analytics initialized:', GA_MEASUREMENT_ID)
  })
}

/**
 * 追蹤自訂事件
 * @param eventName - 事件名稱
 * @param eventParams - 事件參數
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (!GA_MEASUREMENT_ID || import.meta.env.DEV) {
    console.log('[GA] Event (dev mode):', eventName, eventParams)
    return
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams)
    console.log('[GA] Event tracked:', eventName, eventParams)
  }
}

/**
 * 追蹤頁面瀏覽
 * @param pageTitle - 頁面標題
 * @param pagePath - 頁面路徑
 */
export function trackPageView(pageTitle?: string, pagePath?: string) {
  if (!GA_MEASUREMENT_ID || import.meta.env.DEV) {
    console.log('[GA] Page view (dev mode):', pageTitle, pagePath)
    return
  }

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || document.title,
      page_path: pagePath || window.location.pathname,
    })
    console.log('[GA] Page view tracked:', pageTitle, pagePath)
  }
}

/**
 * 追蹤社群分享事件
 * @param platform - 社群平台名稱
 * @param url - 分享的 URL
 */
export function trackShare(platform: string, url?: string) {
  trackEvent('share', {
    method: platform,
    content_type: 'website',
    item_id: url || window.location.href,
  })
}

/**
 * 追蹤外部連結點擊
 * @param url - 外部連結 URL
 * @param label - 連結標籤
 */
export function trackOutboundLink(url: string, label?: string) {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: label || url,
    value: url,
  })
}

/**
 * 追蹤聯絡互動
 * @param method - 聯絡方式（email, github, linkedin）
 */
export function trackContact(method: string) {
  trackEvent('contact', {
    method,
    event_category: 'engagement',
  })
}
