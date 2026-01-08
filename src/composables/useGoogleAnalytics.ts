/**
 * Google Analytics 4 整合
 * 提供事件追蹤功能
 *
 * 注意：gtag.js 已在 index.html 中載入，這裡只提供事件追蹤工具函數
 */

// 擴展 Window 介面以支援 gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

/**
 * 初始化 Google Analytics
 * gtag 已在 index.html 中初始化，此函數僅用於保持一致性
 */
export function useGoogleAnalytics() {
  // gtag.js 已在 index.html 中載入，無需額外初始化
  if (import.meta.env.DEV) {
    console.log('[GA] Development mode - event tracking will be logged to console')
  }
}

/**
 * 追蹤自訂事件
 * @param eventName - 事件名稱
 * @param eventParams - 事件參數
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (import.meta.env.DEV) {
    console.log('[GA] Event (dev mode):', eventName, eventParams)
    return
  }

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams)
  }
}

/**
 * 追蹤頁面瀏覽
 * @param pageTitle - 頁面標題
 * @param pagePath - 頁面路徑
 */
export function trackPageView(pageTitle?: string, pagePath?: string) {
  if (import.meta.env.DEV) {
    console.log('[GA] Page view (dev mode):', pageTitle, pagePath)
    return
  }

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_title: pageTitle || document.title,
      page_path: pagePath || window.location.pathname,
    })
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
