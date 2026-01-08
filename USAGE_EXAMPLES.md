# 效能優化功能使用範例

## 📸 圖片懶加載

### 方法 1: 全域懶加載（推薦用於多張圖片）

```vue
<template>
  <div class="gallery">
    <!-- 使用 data-src 替代 src -->
    <img
      data-src="/images/project1.jpg"
      alt="專案 1"
      class="project-image"
    >
    <img
      data-src="/images/project2.jpg"
      alt="專案 2"
      class="project-image"
    >
    <img
      data-src="/images/project3.jpg"
      alt="專案 3"
      class="project-image"
    >
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useLazyLoad } from '@/composables/useLazyLoad'

// 自動偵測所有帶有 data-src 的圖片
onMounted(() => {
  useLazyLoad()
})
</script>

<style scoped>
.project-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>
```

### 方法 2: 單一圖片懶加載（帶載入狀態）

```vue
<template>
  <div class="image-container">
    <img
      ref="imgRef"
      data-src="/images/hero-banner.jpg"
      alt="首頁橫幅"
      class="hero-image"
    >

    <!-- 載入中提示 -->
    <div v-if="!isLoaded" class="loading-spinner">
      載入中...
    </div>

    <!-- 載入失敗提示 -->
    <div v-if="hasError" class="error-message">
      圖片載入失敗
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLazyImage } from '@/composables/useLazyLoad'

const imgRef = ref<HTMLImageElement | null>(null)
const { isLoaded, hasError } = useLazyImage(imgRef)
</script>

<style scoped>
.image-container {
  position: relative;
  min-height: 400px;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #999;
}

.error-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #e74c3c;
}
</style>
```

### 方法 3: 動態新增圖片

```vue
<template>
  <div>
    <button @click="loadMoreImages">載入更多</button>

    <div class="image-grid">
      <img
        v-for="image in images"
        :key="image.id"
        :data-src="image.url"
        :alt="image.title"
        class="grid-image"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useLazyLoad } from '@/composables/useLazyLoad'

const images = ref([
  { id: 1, url: '/images/img1.jpg', title: 'Image 1' }
])

const { observeImage } = useLazyLoad()

async function loadMoreImages() {
  // 新增圖片
  images.value.push(
    { id: 2, url: '/images/img2.jpg', title: 'Image 2' },
    { id: 3, url: '/images/img3.jpg', title: 'Image 3' }
  )

  // 等待 DOM 更新
  await nextTick()

  // 手動觀察新圖片
  const newImages = document.querySelectorAll('img[data-src]')
  newImages.forEach(img => {
    observeImage(img as HTMLImageElement)
  })
}
</script>
```

## 🔄 Code Splitting

### 路由層級的 Code Splitting

```typescript
// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // 同步載入首頁（關鍵路由）
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // 懶加載次要頁面
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/projects/:id',
      name: 'project-detail',
      // 懶加載專案詳情頁
      component: () => import('../views/ProjectDetailView.vue')
    }
  ]
})

export default router
```

### 組件層級的 Code Splitting

```vue
<template>
  <div>
    <h1>首頁</h1>

    <!-- 重要組件：同步載入 -->
    <HeroSection />

    <!-- 次要組件：懶加載 -->
    <Suspense>
      <template #default>
        <ProjectsGallery />
      </template>
      <template #fallback>
        <div class="loading">載入中...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue'

// 懶加載組件
import { defineAsyncComponent } from 'vue'

const ProjectsGallery = defineAsyncComponent({
  loader: () => import('@/components/ProjectsGallery.vue'),
  loadingComponent: () => import('@/components/LoadingSpinner.vue'),
  delay: 200, // 200ms 後才顯示 loading
  timeout: 3000 // 3 秒後超時
})
</script>
```

## 📦 PWA 離線支援

### 檢測離線狀態

```vue
<template>
  <div>
    <!-- 離線提示 -->
    <div v-if="isOffline" class="offline-banner">
      您目前處於離線狀態
    </div>

    <main>
      <!-- 頁面內容 -->
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isOffline = ref(!navigator.onLine)

function updateOnlineStatus() {
  isOffline.value = !navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateOnlineStatus)
  window.addEventListener('offline', updateOnlineStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateOnlineStatus)
  window.removeEventListener('offline', updateOnlineStatus)
})
</script>

<style scoped>
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #f39c12;
  color: white;
  padding: 1rem;
  text-align: center;
  z-index: 9999;
}
</style>
```

### 自訂更新提示

```vue
<template>
  <div v-if="needRefresh" class="update-prompt">
    <p>有新版本可用！</p>
    <button @click="updateApp">立即更新</button>
    <button @click="dismissUpdate">稍後</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const needRefresh = ref(false)
let updateSWCallback: ((reloadPage?: boolean) => Promise<void>) | null = null

// 這個函數會在 main.ts 中被 PWA 插件調用
;(window as any).__onNeedRefresh = (cb: any) => {
  needRefresh.value = true
  updateSWCallback = cb
}

function updateApp() {
  if (updateSWCallback) {
    updateSWCallback(true)
  }
}

function dismissUpdate() {
  needRefresh.value = false
}
</script>

<style scoped>
.update-prompt {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.update-prompt button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.update-prompt button:first-of-type {
  background: #1a5f3f;
  color: white;
}
</style>
```

## 🎯 效能最佳實踐

### 1. 響應式圖片

```vue
<template>
  <!-- 使用 srcset 提供多種尺寸 -->
  <img
    data-src="/images/project-800.jpg"
    data-srcset="
      /images/project-400.jpg 400w,
      /images/project-800.jpg 800w,
      /images/project-1200.jpg 1200w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
    alt="專案圖片"
  >
</template>
```

### 2. 預載入關鍵資源

```typescript
// router/index.ts
router.beforeEach((to, from, next) => {
  // 預載入下一個可能訪問的頁面
  if (to.name === 'home') {
    // 預載入 about 頁面
    import('../views/AboutView.vue')
  }
  next()
})
```

### 3. 虛擬滾動（大量列表）

```vue
<template>
  <div class="virtual-list" ref="containerRef">
    <div
      v-for="item in visibleItems"
      :key="item.id"
      class="list-item"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})))

const containerRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const itemHeight = 50
const visibleCount = 20

const visibleItems = computed(() => {
  const start = Math.floor(scrollTop.value / itemHeight)
  const end = start + visibleCount
  return items.value.slice(start, end)
})

onMounted(() => {
  containerRef.value?.addEventListener('scroll', (e) => {
    scrollTop.value = (e.target as HTMLElement).scrollTop
  })
})
</script>
```

## 🔍 效能檢測

### 使用 Performance API

```typescript
// composables/usePerformance.ts
export function usePerformance() {
  function measurePageLoad() {
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

      console.log({
        'DNS 查詢時間': perfData.domainLookupEnd - perfData.domainLookupStart,
        'TCP 連接時間': perfData.connectEnd - perfData.connectStart,
        '請求時間': perfData.responseEnd - perfData.requestStart,
        'DOM 解析時間': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        '頁面載入時間': perfData.loadEventEnd - perfData.loadEventStart,
        '總時間': perfData.loadEventEnd - perfData.fetchStart
      })
    })
  }

  return { measurePageLoad }
}
```

## 📚 更多資源

- [Vue.js 效能優化指南](https://vuejs.org/guide/best-practices/performance.html)
- [Web Vitals](https://web.dev/vitals/)
- [PWA 最佳實踐](https://web.dev/progressive-web-apps/)
