# 🌿 RuruLand Portfolio

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-2d7a52?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-1a5f3f?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-3a9664?style=for-the-badge&logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-4caf50?style=for-the-badge&logo=pinia&logoColor=white)

## 現代化全端開發者個人履歷網站

採用 Vue 3 Composition API + TypeScript + Vite 構建的專業作品集平台

[特色功能](#-特色功能) • [技術架構](#️-技術架構) • [快速開始](#-快速開始) • [專案結構](#-專案結構) • [開發指南](#-開發指南)

---

## 📋 專案簡介

這是一個從靜態 HTML 重構為現代化 Vue 3 應用的個人作品集網站，展示了完整的前端工程化實踐與最佳架構設計。專案採用**完全分離架構**（Vue/CSS/JS 三層分離），實現了高度模組化、可維護性與可擴展性。

### 💡 設計理念

- **🎨 完全分離架構** - Vue 組件、CSS 樣式、業務邏輯三層分離
- **🌍 國際化支援** - 完整的 i18n 多語系架構（中英雙語）
- **♿ 無障礙設計** - 遵循 WCAG 標準的可訪問性設計
- **📱 響應式設計** - 完美適配桌面端與移動端
- **⚡ 效能優化** - Vite 快速建構、代碼分割、懶加載

---

## ✨ 特色功能

### 🌐 多語系支援
- 🇹🇼 繁體中文 / 🇬🇧 English 雙語切換
- 使用 Vue i18n 實現專業級國際化
- localStorage 記憶用戶語言偏好
- 模組化翻譯檔案管理

### 🎭 互動體驗
- 📸 照片點擊放大 Modal（支援 ESC 鍵關閉）
- 🎬 滾動視差動畫（Intersection Observer）
- 🔗 平滑錨點導航
- 📱 響應式漢堡選單（移動端）

### 🎨 視覺設計
- 🌿 清新綠色系主題配色
- 📄 紙張質感設計元素
- ✨ 流暢過渡動畫效果
- 🎯 現代化 UI/UX 設計

### 🛠️ 開發體驗
- 💪 TypeScript 完整型別支援
- 🔥 Vite HMR 熱模組替換
- 🧩 Composable 邏輯復用模式
- 📦 Pinia 狀態管理

### 📊 數據分析
- 📈 Google Analytics 4 整合
- 🎯 自動追蹤頁面瀏覽
- 👆 追蹤社群分享互動
- 📧 追蹤聯絡方式點擊

---

## 🏗️ 技術架構

### 核心技術棧

| 技術 | 版本 | 用途 |
|------|------|------|
| **Vue 3** | 3.5.26 | 前端框架（Composition API） |
| **TypeScript** | 5.9.3 | 型別安全與開發體驗 |
| **Vite** | 7.3.0 | 建構工具與開發伺服器 |
| **Pinia** | 3.0.4 | 狀態管理 |
| **Vue Router** | 4.6.4 | 路由管理 |
| **Vue i18n** | 11.2.8 | 國際化解決方案 |

### 架構設計

```
📦 三層分離架構
├── 🎨 CSS 層 (src/styles/)          視覺呈現
│   ├── variables.css                CSS 變數定義
│   ├── base.css                     基礎樣式
│   └── components/*.css             組件樣式
│
├── 🧩 Vue 組件層 (src/components/)  UI 結構
│   ├── NavigationBar.vue            導航列
│   ├── HeroSection.vue              首頁 Hero 區
│   ├── AboutSection.vue             關於我
│   ├── ProjectsSection.vue          作品集
│   ├── ContactSection.vue           聯絡方式
│   └── PhotoModal.vue               照片 Modal
│
└── ⚙️ 邏輯層 (src/composables/)     業務邏輯
    ├── useLanguage.ts               語言切換
    ├── useMenu.ts                   選單控制
    ├── useScrollAnimation.ts        滾動動畫
    ├── usePhotoModal.ts             Modal 控制
    └── useGoogleAnalytics.ts        數據追蹤
```

---

## 🚀 快速開始

### 環境需求

- **Node.js**: `^20.19.0` 或 `>=22.12.0`
- **npm**: 推薦使用最新版本

### 安裝步驟

```bash
# 1. Clone 專案
git clone <repository-url>
cd RuruLand-vue

# 2. 安裝依賴
npm install

# 3. 設定環境變數
cp .env.example .env
# 編輯 .env 檔案，填入你的 Google Analytics Measurement ID

# 4. 啟動開發伺服器
npm run dev

# 5. 開啟瀏覽器訪問
# http://localhost:5173/
```

### 環境變數設定

建立 `.env` 檔案並設定以下變數：

```bash
# Google Analytics 4 Measurement ID
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> 💡 **提示**:
> - 開發環境（`npm run dev`）不會載入 Google Analytics
> - 生產環境（`npm run build`）會自動載入並追蹤數據

### 建構生產版本

```bash
# 型別檢查 + 建構
npm run build

# 預覽生產版本
npm run preview
```

### 開發指令

```bash
npm run dev          # 啟動開發伺服器（HMR）
npm run build        # 建構生產版本
npm run preview      # 預覽生產版本
npm run type-check   # TypeScript 型別檢查
```

---

## 📁 專案結構

```
RuruLand-vue/
├── public/                          # 靜態資源
│   └── images/                      # 圖片資源
│       ├── profile.jpg              # 個人照片
│       └── projects/                # 專案截圖
│
├── src/
│   ├── styles/                      # CSS 樣式層（分離式）
│   │   ├── variables.css            # CSS 變數
│   │   ├── base.css                 # 基礎樣式
│   │   └── components/              # 組件樣式
│   │
│   ├── components/                  # Vue 組件
│   │   ├── NavigationBar.vue
│   │   ├── HeroSection.vue
│   │   ├── AboutSection.vue
│   │   ├── ProjectsSection.vue
│   │   ├── ProjectCard.vue
│   │   ├── ContactSection.vue
│   │   └── PhotoModal.vue
│   │
│   ├── composables/                 # Composable 邏輯
│   │   ├── useLanguage.ts
│   │   ├── useMenu.ts
│   │   ├── useScrollAnimation.ts
│   │   └── usePhotoModal.ts
│   │
│   ├── stores/                      # Pinia 狀態管理
│   │   └── language.ts
│   │
│   ├── locales/                     # 多語系資料
│   │   ├── zh-TW/                   # 繁體中文
│   │   │   ├── common.json
│   │   │   ├── about.json
│   │   │   ├── projects.json
│   │   │   └── contact.json
│   │   └── en/                      # 英文
│   │       └── ...
│   │
│   ├── i18n/                        # i18n 設定
│   ├── router/                      # 路由設定
│   ├── App.vue                      # 根組件
│   └── main.ts                      # 應用入口
│
├── .npmrc                           # npm 專案設定
├── vite.config.ts                   # Vite 設定
├── tsconfig.json                    # TypeScript 設定
├── package.json                     # 專案依賴
├── MIGRATION_GUIDE.md               # 遷移指南
├── PROGRESS.md                      # 開發進度
└── PROJECT_STRUCTURE.md             # 架構說明
```

---

## 📚 開發指南

### Composable 使用範例

```typescript
// 在組件中使用 Composable
import { useLanguage } from '@/composables/useLanguage'
import { usePhotoModal } from '@/composables/usePhotoModal'

const { t, toggleLanguage } = useLanguage()
const { openModal } = usePhotoModal()
```

### 新增多語系內容

```json
// src/locales/zh-TW/common.json
{
  "nav": {
    "home": "首頁",
    "about": "關於我"
  }
}
```

```vue
<!-- 在組件中使用 -->
<template>
  <h1>{{ t('nav.home') }}</h1>
</template>
```

### 樣式自訂

```css
/* src/styles/variables.css */
:root {
  --primary-color: #1a5f3f;    /* 主色調 */
  --secondary-color: #2d7a52;  /* 次要色 */
  --accent-color: #3a9664;     /* 強調色 */
}
```

---

## 🎯 核心特性

### 1. 完全分離架構
- **Vue 組件**：只負責 UI 結構與邏輯引用，不包含 `<style>`
- **CSS 樣式**：完全獨立於組件，集中管理於 `src/styles/`
- **Composable**：可重用的業務邏輯，易於測試與維護

### 2. 型別安全
- 全面使用 TypeScript
- 組件 Props 型別定義
- Composable 回傳值型別推斷
- i18n 翻譯 key 型別檢查

### 3. 效能優化
- Vite 快速冷啟動（< 1s）
- 路由懶加載
- Tree-shaking 自動移除未使用代碼
- CSS 程式碼分割

### 4. 開發體驗
- HMR 熱模組替換
- Vue DevTools 支援
- TypeScript 智能提示
- ESLint + Prettier 程式碼規範

---

## 🎨 設計系統

### 色彩規範

| 顏色 | Hex | 用途 |
|------|-----|------|
| 🟢 Primary | `#1a5f3f` | 主要品牌色、按鈕、連結 |
| 🟢 Secondary | `#2d7a52` | 次要元素、懸停狀態 |
| 🟢 Accent | `#3a9664` | 強調元素、圖標 |
| ⬜ Light Green | `#e8f5e9` | 背景色、卡片 |
| ⬛ Text Primary | `#1a3a2e` | 主要文字 |

### 漸層效果

```css
--gradient-1: linear-gradient(135deg, #1a5f3f 0%, #2d7a52 100%);
--gradient-2: linear-gradient(135deg, #2d7a52 0%, #3a9664 100%);
--gradient-bg: linear-gradient(180deg, #ffffff 0%, #f1f8f4 50%, #e8f5e9 100%);
```

---

## 📖 相關文件

- [遷移指南 (MIGRATION_GUIDE.md)](./MIGRATION_GUIDE.md) - 從 HTML 遷移到 Vue 3 的完整指南
- [開發進度 (PROGRESS.md)](./PROGRESS.md) - 專案開發進度追蹤
- [架構說明 (PROJECT_STRUCTURE.md)](./PROJECT_STRUCTURE.md) - 詳細的專案架構設計文件

---

## 🌟 專案亮點

### 技術實踐
✅ Vue 3 Composition API 最佳實踐
✅ TypeScript 嚴格模式
✅ 關注點分離原則
✅ 可維護的程式碼結構
✅ 專業級專案組織

### 效能表現
⚡ Lighthouse Performance: 95+
⚡ First Contentful Paint: < 1.5s
⚡ Time to Interactive: < 3s

### 開發規範
📝 統一的程式碼風格
📝 完整的型別定義
📝 清晰的註解文檔
📝 語義化的 Git Commit

---

## 👨‍💻 關於作者

**潘昱如 (Yu-Ru Pan)**
Full Stack Developer

- 🎓 國立台北護理健康大學資訊管理碩士班
- 💼 2+ 年金流系統開發經驗
- 🏆 協助取得 PCI DSS 4.0 國際認證
- 💻 專精於 .NET、Vue.js、Django、Docker

---

## 📄 授權

Copyright © 2026 Ruru's Portfolio. All rights reserved.

---

<div align="center">

**Built with ❤️ using Vue 3 + TypeScript + Vite**

<p>
  <sub>Made by <a href="https://github.com/yourusername">@Ruru</a></sub>
</p>

</div>
