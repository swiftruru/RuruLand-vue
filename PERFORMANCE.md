# 效能優化說明文件

本專案已實作完整的效能優化方案，包含圖片懶加載、Code Splitting、資源預載入以及完整的 PWA 功能。

## 📦 已實作的優化項目

### 1. 圖片懶加載 (Lazy Loading)
- **檔案**: `src/composables/useLazyLoad.ts`
- **說明**: 使用 Intersection Observer API 實現高效能的圖片懶加載
- **功能**:
  - 自動偵測進入視窗的圖片並載入
  - 提前 50px 開始預載入
  - 載入完成淡入動畫
  - 載入失敗提示
  - 支援舊瀏覽器 fallback

**使用方法**:
```vue
<template>
  <img data-src="/path/to/image.jpg" alt="描述">
</template>

<script setup>
import { useLazyLoad } from '@/composables/useLazyLoad'
useLazyLoad()
</script>
```

或單一圖片:
```vue
<template>
  <img ref="imgRef" data-src="/path/to/image.jpg" alt="描述">
</template>

<script setup>
import { ref } from 'vue'
import { useLazyImage } from '@/composables/useLazyLoad'

const imgRef = ref(null)
const { isLoaded, hasError } = useLazyImage(imgRef)
</script>
```

### 2. Code Splitting (程式碼分割)
- **檔案**: `vite.config.ts`
- **說明**: 將應用程式分割成多個小 chunk，按需載入
- **優化**:
  - Vue 相關套件獨立打包 (`vue-vendor`)
  - i18n 獨立打包 (`i18n-vendor`)
  - 路由層級的 code splitting
  - CSS 程式碼分割

**配置**:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-vendor': ['vue', 'vue-router', 'pinia'],
        'i18n-vendor': ['vue-i18n'],
      },
    },
  },
}
```

### 3. 資源預載入 (Resource Hints)
- **檔案**: `index.html`
- **說明**: 優化關鍵資源的載入順序
- **優化**:
  - **Preconnect**: 提前建立與外部域名的連接（Google Fonts, Google Analytics）
  - **DNS Prefetch**: DNS 預解析
  - **Preload**: 預載入關鍵資源（CSS, JS）
  - **Prefetch**: 預取重要圖片

**範例**:
```html
<!-- Preconnect to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Preload Critical Resources -->
<link rel="preload" href="/src/main.ts" as="script" crossorigin>
<link rel="preload" href="/src/styles/variables.css" as="style">
```

### 4. Service Worker & PWA
- **檔案**: `vite.config.ts`, `src/main.ts`
- **說明**: 完整的 Progressive Web App 功能
- **功能**:
  - ✅ 離線支援
  - ✅ 背景同步
  - ✅ 推播通知（預留）
  - ✅ 安裝到桌面
  - ✅ 自動更新

**緩存策略**:
- **Google Fonts**: CacheFirst (1年)
- **圖片**: CacheFirst (30天, 最多100個)
- **JS/CSS**: StaleWhileRevalidate (7天, 最多60個)

**PWA Manifest**:
```json
{
  "name": "RuruLand Portfolio",
  "short_name": "RuruLand",
  "theme_color": "#1a5f3f",
  "background_color": "#f8fdf9",
  "display": "standalone"
}
```

### 5. 壓縮與最小化
- **檔案**: `vite.config.ts`
- **說明**: 生產環境程式碼優化
- **優化**:
  - Terser 壓縮
  - 移除 console.log
  - 移除 debugger
  - CSS 最小化

## 📊 效能指標目標

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### 其他指標
- **FCP (First Contentful Paint)**: < 1.8s
- **TTI (Time to Interactive)**: < 3.8s
- **Speed Index**: < 3.4s

## 🔧 開發指令

```bash
# 開發模式（PWA 關閉）
npm run dev

# 構建生產版本（包含 PWA）
npm run build

# 預覽生產版本
npm run preview

# 類型檢查
npm run type-check
```

## 🚀 部署檢查清單

- [ ] 執行 `npm run build` 確認構建成功
- [ ] 檢查 Service Worker 是否正確註冊
- [ ] 測試離線功能
- [ ] 驗證圖片懶加載運作
- [ ] 檢查 Lighthouse 分數
- [ ] 測試 PWA 安裝功能

## 📱 PWA 功能測試

1. **Desktop**: Chrome > 網址列右側 > 安裝圖示
2. **Mobile**: Chrome > 選單 > 新增至主畫面
3. **離線測試**: 開發工具 > Network > Offline

## 🎯 最佳實踐

### 圖片優化
- 使用 WebP 格式
- 提供多種尺寸（響應式）
- 設定適當的 `width` 和 `height` 屬性
- 使用 `loading="lazy"` 屬性（備用方案）

### 字體優化
- 使用 `font-display: swap`
- Preconnect 到字體 CDN
- 考慮使用系統字體

### JavaScript 優化
- 避免大型第三方庫
- Tree-shaking 移除未使用程式碼
- 使用動態 import

## 🔍 效能監控

建議使用以下工具監控效能：
- **Lighthouse**: Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **PageSpeed Insights**: https://pagespeed.web.dev/

## 📚 相關文件

- [Vite 效能優化](https://vitejs.dev/guide/performance.html)
- [PWA 文件](https://vite-pwa-org.netlify.app/)
- [Web Vitals](https://web.dev/vitals/)
- [Lazy Loading Images](https://web.dev/lazy-loading-images/)
